module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
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
          allowNull: false
      },
      address: DataTypes.STRING,
      email: {
          type: DataTypes.STRING,
          allowNull: false
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      },
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      accountConfirmation: {
          type: DataTypes.BOOLEAN,
          defaultValue: false 
      },
      emailToken: DataTypes.STRING,
      emailTokenExpiration: DataTypes.DATE,
      resetToken: DataTypes.STRING,
      resetTokenExpiration: DataTypes.DATE,
      failedLoginAttempts: {
          type: DataTypes.INTEGER,
          defaultValue: 0 
      },
      lastPasswordChange: {
        type: DataTypes.DATE,
        allowNull: true
    },
      lockedUntil: {
          type: DataTypes.DATE,
          allowNull: true 
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
  });

  User.associate = models => {
      User.hasMany(models.Order, { foreignKey: 'userId' });
  };

  return User;
};
