const {
  RefreshTokenDefinition,
} = require('../../refresh-token/model/refresh-token.definition');
const {
  EmailVerificationDefinition,
} = require('../../email-verification/model/email-verification.definition');
const { UserDefinition } = require('./user.definition');

UserDefinition.hasOne(RefreshTokenDefinition);
UserDefinition.hasOne(EmailVerificationDefinition);

exports.User = UserDefinition;
