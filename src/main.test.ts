import { pause } from './main.js'

let setTimeoutSpy

beforeEach(() => {
  jest.useFakeTimers()

  setTimeoutSpy = jest.spyOn(global, 'setTimeout')
})

describe('pause', () => {
  afterEach(() => expect(setTimeoutSpy).toBeCalledTimes(1))

  test('pause()', async () => {
    pause()

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), undefined)
  })

  test('pause(1000)', () => {
    pause(1000)

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 1000)
  })

  test('pause(1000, () => 1)', async () => {
    const pausePromise = pause(1000, () => 1)

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 1000)

    jest.runAllTimers()

    expect(await pausePromise).toBe(1)
  })

  test('pause(1000, (...args) => args, 1, 2, 3)', async () => {
    const pausePromise = pause(1000, (...args) => args, 1, 2, 3)

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 1000)

    jest.runAllTimers()

    expect(await pausePromise).toEqual([1, 2, 3])
  })

  test('pause(1000, () => { throw Error() })', async () => {
    const pausePromise = pause(1000, () => {
      throw Error()
    })

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 1000)

    jest.runAllTimers()

    await expect(pausePromise).rejects.toThrow()
  })

  test('pause(1000, cb).abort()', async () => {
    const cb = jest.fn()
    pause(1000, cb).abort()

    expect(setTimeoutSpy).toBeCalledWith(expect.any(Function), 1000)

    jest.runAllTimers()

    expect(cb).not.toBeCalled()
  })
})
