const {
  EmailVerificationDefinition,
} = require('./email-verification.definition');
const {
  UserDefinition,
} = require('../../../modules/user/model/user.definition');

EmailVerificationDefinition.belongsTo(UserDefinition);

exports.EmailVerification = EmailVerificationDefinition;
