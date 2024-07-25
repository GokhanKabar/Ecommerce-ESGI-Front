const { User, Order } = require('../databases/sequelize/models');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const checkUserPermissionsOrder = () => async (req, res, next) => {
  const header = req.headers.authorization ?? req.headers.Authorization;
  const orderId = req.params.id;

  if (!header) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const [type, token] = header.split(/\s+/);

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, config.development.privateKey);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (user.role === 'ADMIN') {
      return next();
    }

    if (user.role === 'USER') {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (order.user_id === user.id) {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    return res.status(403).json({ message: 'Forbidden: Access denied' });
  } catch (error) {
    console.error('Error in checkUserPermissionsOrder:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = checkUserPermissionsOrder;
