interface ServerResponse {
  status: number;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

class ServerError extends Error implements ServerResponse {
  constructor(
    public status: number,
    public success: boolean,
    public message: string,
    public data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export { ServerResponse, ServerError };
