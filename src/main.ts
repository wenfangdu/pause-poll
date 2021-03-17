interface PromiseWithAbort extends Promise<any> {
  abort: () => void
}

export const pause = (
  ms?: number,
  cb?: (...args: any[]) => any,
  ...args: any[]
): PromiseWithAbort => {
  let timeout

  const promise: any = new Promise((resolve, reject) => {
    timeout = setTimeout(async () => {
      try {
        resolve(await cb?.(...args))
      } catch (error) {
        reject(error)
      }
    }, ms)
  })

  promise.abort = () => clearTimeout(timeout)

  return promise
}

export const poll = async (
  interval: number,
  times: number,
  cb?: (
    ...args: [
      ...args: any[],
      resolve: (value: any) => any,
      reject: (reason: any) => any,
    ]
  ) => any,
  ...args: any[]
): Promise<any> => {
  let result
  const resolve = value => (times = 0) || (result = value)
  const reject = reason => (times = 0) || (result = Promise.reject(reason))

  await (async function basePoll() {
    if (times > 0) {
      const _result = await cb?.(...args, resolve, reject)

      if (times) {
        result = _result
        --times && (await pause(interval, basePoll))
      }
    }
  })()

  return result
}
