const { RefreshTokenDefinition } = require('./refresh-token.definition');
const {
  UserDefinition,
} = require('../../../modules/user/model/user.definition');

RefreshTokenDefinition.belongsTo(UserDefinition, {
  foreignKey: {
    allowNull: false,
  },
});

exports.RefreshToken = RefreshTokenDefinition;
