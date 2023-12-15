exports.ResourceException = class extends Error {
  status;
  name;

  constructor(status, name, message) {
    super(message);

    this.name = name;
    this.status = status;
  }
};
