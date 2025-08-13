export function getHttpErrorMessage(error) {
    if (!error)
        return null;
    if (typeof error === "string")
        return error;
    if (error instanceof Error)
        return error.message;
    return "Oops! Something went wrong.";
}
export const makeSuccessResponse = (data) => {
    const response = { status: "success", data };
    return response;
};
export const makeErrorResponse = (message = "Internal Server Error") => {
    const response = { status: "error", message };
    return response;
};
