export const pause = (
  ms?: number,
  cb?: (...args: unknown[]) => unknown,
  ...args: unknown[]
): Promise<unknown> & {
  abort: () => void
} => {
  let timeout

  const promise = Object.assign(
    new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        try {
          resolve(cb?.(...args))
        } catch (error) {
          reject(error)
        }
      }, ms)
    }),
    {
      abort: () => clearTimeout(timeout),
    },
  )

  return promise
}

export const poll = async (
  interval: number,
  times: number,
  cb?: (
    ...args: [
      ...args: unknown[],
      resolve: (value: unknown) => unknown,
      reject: (reason: unknown) => unknown,
    ]
  ) => unknown,
  ...args: unknown[]
): Promise<unknown> => {
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
