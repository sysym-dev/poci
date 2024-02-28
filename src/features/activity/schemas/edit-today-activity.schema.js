export const editTodayActivitySchema = {
  name: {
    isString: {
      errorMessage: 'name invalid',
    },
    notEmpty: {
      errorMessage: 'name required',
    },
  },
};
