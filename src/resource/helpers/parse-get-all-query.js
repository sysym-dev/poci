exports.parseGetAllQuery = function (rawQuery) {
  const page = {
    size: rawQuery.page?.size || 10,
  };

  return {
    page,
  };
};
