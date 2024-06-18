const UserMongo = require('../../../databases/mongoose/User'); // Chemin vers le modèle Mongoose

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
  },
  {
    hooks: {
      afterCreate: async (user, options) => {
        console.log('afterCreate hook called for user:', user.id);
        try {
          await UserMongo.create({
            sequelizeId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role: user.role,
            accountConfirmation: user.accountConfirmation,
            emailToken: user.emailToken,
            emailTokenExpiration: user.emailTokenExpiration,
            resetToken: user.resetToken,
            resetTokenExpiration: user.resetTokenExpiration,
            failedLoginAttempts: user.failedLoginAttempts,
            lastPasswordChange: user.lastPasswordChange,
            lockedUntil: user.lockedUntil,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après création:', error);
        }
      },
      afterUpdate: async (user, options) => {
        console.log('afterUpdate hook called for user:', user.id);
        try {
          const userMongo = await UserMongo.findOne({ sequelizeId: user.id });
          if (userMongo) {
            userMongo.firstName = user.firstName;
            userMongo.lastName = user.lastName;
            userMongo.address = user.address;
            userMongo.email = user.email;
            userMongo.password = user.password;
            userMongo.phone = user.phone;
            userMongo.role = user.role;
            userMongo.accountConfirmation = user.accountConfirmation;
            userMongo.emailToken = user.emailToken;
            userMongo.emailTokenExpiration = user.emailTokenExpiration;
            userMongo.resetToken = user.resetToken;
            userMongo.resetTokenExpiration = user.resetTokenExpiration;
            userMongo.failedLoginAttempts = user.failedLoginAttempts;
            userMongo.lastPasswordChange = user.lastPasswordChange;
            userMongo.lockedUntil = user.lockedUntil;
            userMongo.updatedAt = new Date();
            await userMongo.save();
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après mise à jour:', error);
        }
      },
      afterDestroy: async (user, options) => {
        console.log('afterDestroy hook called for user:', user.id);

        try {
          await UserMongo.findOneAndDelete({ sequelizeId: user.id });
        } catch (error) {
          console.error('Erreur lors de la synchronisation avec MongoDB après suppression:', error);
        }
      },
    },
  });

  User.associate = models => {
    User.hasMany(models.Order, { foreignKey: 'userId' });
  };

  return User;
};
