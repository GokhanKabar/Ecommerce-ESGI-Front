const mongoose = require("mongoose");
const UserMongo = require("../mongoose/User");

module.exports = async function (userId, User, Order, onlyRemove = false) {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Order,
          attributes: ["id", "status", "totalAmount", "createdAt", "updatedAt"],
          order: [["createdAt", "DESC"]],
          limit: 5,
        },
      ],
    });

    
    if (!user) {
      return;
    }

    await UserMongo.deleteOne({ sequelizeId: userId });
    if (!onlyRemove) {
      const userMongo = new UserMongo({
        sequelizeId: userId,
        ...user.dataValues,
        Orders: user.Orders ? user.Orders.map((order) => order.dataValues) : [],
      });

      await userMongo.save();
    }
  } catch (error) {
    console.error("Error in userMongo function:", error);
  }
};
