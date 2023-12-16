exports.optionalProperty = function (cond, value) {
  return cond ? value : {};
};
