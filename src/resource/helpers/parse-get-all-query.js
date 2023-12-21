exports.parseGetAllQuery = function (rawQuery) {
  const pageSize = rawQuery.page?.size || 10;
  const pageNumber = rawQuery.page?.number || 1;
  const filter = rawQuery.filter || {};
  const sortColumn = rawQuery.sort?.column || 'id';
  const sortDirection = rawQuery.sort?.direction || 'asc';
  const include = rawQuery.include ?? [];

  const page = {
    size: pageSize,
    number: pageNumber,
    offset: (pageNumber - 1) * pageSize,
  };
  const sort = [sortColumn, sortDirection];

  return {
    page,
    filter,
    sort,
    include,
  };
};
