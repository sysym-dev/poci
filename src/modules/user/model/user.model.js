const {
  RefreshTokenDefinition,
} = require('../../../features/refresh-token/model/refresh-token.definition');
const { UserDefinition } = require('./user.definition');

UserDefinition.hasOne(RefreshTokenDefinition);

exports.User = UserDefinition;
