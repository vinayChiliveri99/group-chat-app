module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: DataTypes.STRING,
    groupAdmin: {
      type: DataTypes.UUID,
    },
  });

  return Channel;
};
