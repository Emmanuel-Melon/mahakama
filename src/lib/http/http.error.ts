import { HttpStatus } from "@/http-status";

export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly statusCode: number = 500,
    isOperational = true,
  ) {
    super(message);
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class HttpError extends Error {
  status: (typeof HttpStatus)[keyof typeof HttpStatus];
  code: string;

  constructor(
    status: (typeof HttpStatus)[keyof typeof HttpStatus],
    message: string,
    code?: string,
  ) {
    super(message);
    this.status = status;
    this.code = code ?? status.statusCode.toString();

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class EntityNotFoundError extends Error {
  constructor(message: string);
  constructor(entity: string, id: string | number);
  constructor(arg1: string, arg2?: string | number) {
    const message =
      arg2 !== undefined ? `${arg1} with ID ${arg2} not found` : arg1;
    super(message);
    this.name = "EntityNotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
