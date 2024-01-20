exports.parseGetOneQuery = function (rawQuery) {
  const include = rawQuery.include ?? [];

  return {
    include,
  };
};
