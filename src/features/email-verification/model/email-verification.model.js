const {
  EmailVerificationDefinition,
} = require('./email-verification.definition');
const { UserDefinition } = require('../../user/model/user.definition');

EmailVerificationDefinition.belongsTo(UserDefinition);

exports.EmailVerification = EmailVerificationDefinition;
