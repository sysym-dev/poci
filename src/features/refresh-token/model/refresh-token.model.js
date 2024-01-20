const { RefreshTokenDefinition } = require('./refresh-token.definition');
const { UserDefinition } = require('../..//user/model/user.definition');

RefreshTokenDefinition.belongsTo(UserDefinition, {
  foreignKey: {
    allowNull: false,
  },
});

exports.RefreshToken = RefreshTokenDefinition;
