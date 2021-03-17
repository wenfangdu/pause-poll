interface PromiseWithAbort extends Promise<unknown> {
    abort: () => void;
}
export declare const pause: (ms?: number, cb?: (...args: unknown[]) => unknown, ...args: unknown[]) => PromiseWithAbort;
export declare const poll: (interval: number, times: number, cb?: (...args: [...args: unknown[], resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown]) => unknown, ...args: unknown[]) => Promise<unknown>;
export {};
