export class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}
export class HTTPError extends CustomError {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
