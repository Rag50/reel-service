import type { ErrorResponse, SuccessResponse } from "./types.js";
export declare function getHttpErrorMessage(error: any): string | null;
export declare const makeSuccessResponse: <T extends any>(data: T) => SuccessResponse<T>;
export declare const makeErrorResponse: (message?: string) => ErrorResponse;
//# sourceMappingURL=http.d.ts.map