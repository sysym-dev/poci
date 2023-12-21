exports.createResourceIncludeQuery = function (resource, query) {
  return [...query.include];
};
