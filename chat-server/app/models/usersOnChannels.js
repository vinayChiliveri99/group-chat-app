module.exports = (sequelize, DataTypes) => {
  const UsersOnChannels = sequelize.define('UsersOnChannels', {
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return UsersOnChannels;
};
