export const updateIsDoneSchema = {
  is_done: {
    isBoolean: {
      errorMessage: 'is_done invalid',
    },
    notEmpty: {
      errorMessage: 'is_done required',
    },
  },
};
