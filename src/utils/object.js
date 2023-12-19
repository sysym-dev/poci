exports.optionalProperty = function (cond, value) {
  return cond ? (typeof value === 'function' ? value() : value) : {};
};
