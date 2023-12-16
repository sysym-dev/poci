exports.parseGetAllQuery = function (rawQuery) {
  const pageSize = rawQuery.page?.size || 10;
  const pageNumber = rawQuery.page?.number || 1;

  const page = {
    size: pageSize,
    number: pageNumber,
    offset: (pageNumber - 1) * pageSize,
  };

  return {
    page,
    filter: rawQuery.filter ?? {},
  };
};
