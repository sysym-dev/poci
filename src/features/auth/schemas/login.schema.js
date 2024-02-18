export const loginSchema = {
  email: {
    isEmail: {
      errorMessage: 'email invalid',
    },
    notEmpty: {
      errorMessage: 'email required',
    },
  },
  password: {
    isString: {
      errorMessage: 'password invalid',
    },
    notEmpty: {
      errorMessage: 'password required',
    },
  },
};
