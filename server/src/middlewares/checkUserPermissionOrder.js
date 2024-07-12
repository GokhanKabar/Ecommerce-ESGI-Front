// const { User, Order } = require('../databases/sequelize/models');




// exports.checkUserPermissionsOrderDetails = async (req, res, next) => {
//   const userId = store.state.user.id; 
//   const isAdmin = false; 
//   const orderId = req.params.id;

  
  
//   try {
  
//     const decoded = jwt.verify(token, config.development.privateKey);
//     const user = await User.findByPk(decoded.id);
//     if (!user) {
//       return res.sendStatus(401);
//     }
//     if(user.role==='ADMIN') isAdmin = true;


//     const order = await Order.findByPk(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Vérifiez si l'utilisateur est admin ou le créateur de la commande
//     if (isAdmin || order.user_id === userId) {
//       return next(); // Autoriser l'accès à l'API
//     }

//     return res.status(403).json({ message: 'Accès refusé' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };


