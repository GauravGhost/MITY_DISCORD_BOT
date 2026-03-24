/**
 * A base custom error class to allow for specific error types with custom status codes or messages.
 */
export class AppError extends Error {
    public isOperational: boolean;

    constructor(message: string, isOperational: boolean = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        this.name = this.constructor.name;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when a user provides invalid input or executes a command incorrectly.
 */
export class ClientError extends AppError {
    constructor(message: string) {
        super(message, true);
    }
}

/**
 * Thrown when an internal database or server error occurs.
 */
export class InternalError extends AppError {
    constructor(message: string) {
        super(message, true);
    }
}
