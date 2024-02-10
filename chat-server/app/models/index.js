const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

// setting up the db.

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user')(sequelize, Sequelize);
db.chat = require('../models/chat')(sequelize, Sequelize);
db.channel = require('../models/channel')(sequelize, Sequelize);
db.usersOnChannel = require('../models/usersOnChannels')(
  sequelize,
  Sequelize
);

db.user.hasMany(db.chat, { foreignKey: 'authorId' });
db.chat.belongsTo(db.user, { foreignKey: 'authorId' });

// User - UsersOnChannels - Channel (Many-to-Many)
db.user.belongsToMany(db.channel, {
  through: db.usersOnChannel,
  foreignKey: 'userId',
});
db.channel.belongsToMany(db.user, {
  through: db.usersOnChannel,
  foreignKey: 'channelId',
});

// Chat - Channel (Many-to-One)
db.chat.belongsTo(db.channel, { foreignKey: 'channelId' });
db.channel.hasMany(db.chat, { foreignKey: 'channelId' });

module.exports = db;
