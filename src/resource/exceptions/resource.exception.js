exports.ResourceException = class extends Error {
  status;
  name;
  details;

  constructor(status, name, message, details) {
    super(message);

    this.name = name;
    this.status = status;
    this.details = details;
  }
};
