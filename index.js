import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { validationResult, matchedData, checkSchema } from 'express-validator';

const app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(
  flash({
    sessionKeyName: 'flash',
  }),
);

app.get('/login', (req, res) => {
  return res.render('login');
});
app.post('/login', [
  checkSchema({
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
  }),
  (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      res.flash('error', error.array()[0].msg);

      return res.redirect('/login');
    }

    return res.send(matchedData(req));
  },
]);

app.listen(3000, () => {
  console.log('app listen at 3000');
});
