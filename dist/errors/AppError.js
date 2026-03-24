"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ClientError = exports.AppError = void 0;
/**
 * A base custom error class to allow for specific error types with custom status codes or messages.
 */
class AppError extends Error {
    isOperational;
    constructor(message, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        this.name = this.constructor.name;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Thrown when a user provides invalid input or executes a command incorrectly.
 */
class ClientError extends AppError {
    constructor(message) {
        super(message, true);
    }
}
exports.ClientError = ClientError;
/**
 * Thrown when an internal database or server error occurs.
 */
class InternalError extends AppError {
    constructor(message) {
        super(message, true);
    }
}
exports.InternalError = InternalError;
