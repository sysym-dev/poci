const { ForgotPasswordDefinition } = require('./forgot-password.definition');
const { UserDefintion } = require('../../user/model/user.definition');

ForgotPasswordDefinition.belongsTo(UserDefintion);

exports.ForgotPassword = ForgotPasswordDefinition;
