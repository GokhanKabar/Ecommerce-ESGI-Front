const { DataTypes, Model } = require('sequelize');
const userMongo = require('../../denormalization/UserMongo');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'userId' });
    }

    static addHooks(db) {
      User.addHook("afterCreate", async (user) => {
        await userMongo(user.id, db.User, db.Order);
      });

      User.addHook("afterUpdate", async (user) => {
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
     deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }, rgpdChecked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
