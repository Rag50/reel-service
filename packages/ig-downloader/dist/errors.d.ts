export declare class CustomError extends Error {
    constructor(message: string);
}
export declare class HTTPError extends CustomError {
    status: number;
    constructor(message: string, status?: number);
}
//# sourceMappingURL=errors.d.ts.map