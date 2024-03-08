export const registerSchema = {
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
  password_confirmation: {
    isString: {
      errorMessage: 'password confirmation invalid',
    },
    notEmpty: {
      errorMessage: 'password confirmation required',
    },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'password confirmation doesnt match',
    },
  },
};
