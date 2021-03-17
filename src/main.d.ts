interface PromiseWithAbort extends Promise<any> {
    abort: () => void;
}
export declare const pause: (ms?: number, cb?: (...args: any[]) => any, ...args: any[]) => PromiseWithAbort;
export declare const poll: (interval: number, times: number, cb?: (...args: [...args: any[], resolve: (value: any) => any, reject: (reason: any) => any]) => any, ...args: any[]) => Promise<any>;
export {};
