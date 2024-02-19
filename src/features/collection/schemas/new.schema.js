export const newSchma = {
  name: {
    isString: {
      errorMessage: 'name invalid',
    },
    notEmpty: {
      errorMessage: 'name required',
    },
  },
};
