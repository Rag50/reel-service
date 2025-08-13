export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class HTTPError extends CustomError {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
} 