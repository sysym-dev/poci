const { ForgotPasswordDefinition } = require('./forgot-password.definition');
const { UserDefinition } = require('../../user/model/user.definition');

ForgotPasswordDefinition.belongsTo(UserDefinition);

exports.ForgotPassword = ForgotPasswordDefinition;
