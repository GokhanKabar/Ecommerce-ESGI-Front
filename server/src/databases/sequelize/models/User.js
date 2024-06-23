const { DataTypes, Model } = require('sequelize');
const userMongo = require('../../denormalization/UserMongo');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      console.log('Associating User');
      User.hasMany(models.Order, { foreignKey: 'userId' });
    }

    static addHooks(db) {
      User.addHook("afterCreate", async (user) => {
        console.log("afterCreate hook triggered for user:", user);
        await userMongo(user.id, db.User, db.Order);
      });

      User.addHook("afterUpdate", async (user) => {
        console.log("afterUpdate hook triggered for user:", user);
        await userMongo(user.id, db.User, db.Order);
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    role: DataTypes.STRING,
    accountConfirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailToken: DataTypes.STRING,
    emailTokenExpiration: DataTypes.DATE,
    resetToken: DataTypes.STRING,
    resetTokenExpiration: DataTypes.DATE,
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
