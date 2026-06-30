// Layer 3 — Shared error types and messages for API routes.
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retryAfter = 0
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super("Demasiadas solicitudes. Ve un poco más despacio.", 429, retryAfter);
    this.name = "RateLimitError";
  }
}

export class ValidationError extends AppError {
  constructor(details?: Record<string, string[]>) {
    super("La validación falló", 400);
    this.name = "ValidationError";
    if (details) (this as Record<string, unknown>).details = details;
  }
}

export class TimeoutError extends AppError {
  constructor() {
    super("La solicitud tardó demasiado. Inténtalo de nuevo.", 504);
    this.name = "TimeoutError";
  }
}

export class ModelError extends AppError {
  constructor() {
    super("El modelo de IA tuvo un problema. Inténtalo en unos minutos.", 503);
    this.name = "ModelError";
  }
}

export class InvalidBodyError extends AppError {
  constructor() {
    super("Cuerpo JSON inválido.", 400);
    this.name = "InvalidBodyError";
  }
}

export function classifyError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof DOMException && err.name === "AbortError") return new TimeoutError();
  if (err instanceof Error) {
    if (err.message.includes("timed out") || err.message.includes("timeout"))
      return new TimeoutError();
    if (err.message.includes("model") || err.message.includes("AI"))
      return new ModelError();
  }
  return new ModelError();
}