const {
  RefreshTokenDefinition,
} = require('../../refresh-token/model/refresh-token.definition');
const {
  EmailVerificationDefinition,
} = require('../../email-verification/model/email-verification.definition');
const { UserDefinition } = require('./user.definition');
const {
  ForgotPasswordDefinition,
} = require('../../forgot-password/model/forgot-password.definition');

UserDefinition.hasOne(RefreshTokenDefinition);
UserDefinition.hasOne(EmailVerificationDefinition);
UserDefinition.hasOne(ForgotPasswordDefinition);

exports.User = UserDefinition;
