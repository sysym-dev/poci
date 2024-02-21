export const newItemSchema = {
  name: {
    isString: {
      errorMessage: 'name invalid',
    },
    notEmpty: {
      errorMessage: 'name required',
    },
  },
};
