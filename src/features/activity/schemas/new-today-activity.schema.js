export const newTodayActivitySchema = {
  name: {
    isString: {
      errorMessage: 'name invalid',
    },
    notEmpty: {
      errorMessage: 'name required',
    },
  },
};
