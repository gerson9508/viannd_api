export class AppError extends Error {
   constructor(
      public readonly statusCode: number,
      message: string,
      public readonly code?: string
   ) {
      super(message);
      this.name = this.constructor.name;
   }
}

export class BadRequestError extends AppError {
   constructor(message = 'Solicitud inválida', code?: string) {
      super(400, message, code ?? 'BAD_REQUEST');
   }
}

export class UnauthorizedError extends AppError {
   constructor(message = 'No autorizado', code?: string) {
      super(401, message, code ?? 'UNAUTHORIZED');
   }
}

export class ForbiddenError extends AppError {
   constructor(message = 'Acceso denegado', code?: string) {
      super(403, message, code ?? 'FORBIDDEN');
   }
}

export class NotFoundError extends AppError {
   constructor(resource = 'Recurso', code?: string) {
      super(404, `${resource} no encontrado`, code ?? 'NOT_FOUND');
   }
}

export class ConflictError extends AppError {
   constructor(message = 'Conflicto de datos', code?: string) {
      super(409, message, code ?? 'CONFLICT');
   }
}