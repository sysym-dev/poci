exports.HttpException = class extends Error {
  status;
  name;
  details;

  constructor(status, name, message, details) {
    super(message);

    this.name = name;
    this.status = status;
    this.details = details;
  }

  toResponse() {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
      details: this.details,
    };
  }
};
