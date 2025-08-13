import type { ErrorResponse, SuccessResponse } from "./types.js";

export function getHttpErrorMessage(error: any): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Oops! Something went wrong.";
}

export const makeSuccessResponse = <T extends any>(data: T) => {
  const response: SuccessResponse<T> = { status: "success", data };
  return response;
};

export const makeErrorResponse = (message: string = "Internal Server Error") => {
  const response: ErrorResponse = { status: "error", message };
  return response;
}; 