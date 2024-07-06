const { Order, OrderProduct, Product, User } = require('../databases/sequelize/models');


exports.createOrder= async (req, res) =>{
    try {
        const orde = await Order.create(req.body);
        res.status(201).json(Order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.getAllOrders=async(req, res)=>{
    try {
        const allOrders=await Order.find();
        res.status(200).json(allOrders);
        console.log('allOrdersHere')
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.getOrderById=async(req, res)=>{
    try {
        const Order=await Order.findById(req.params.id);
        res.status(200).json(allOrders);
        console.log('allOrdersHere')
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.id; // Get order ID from request params
  
      // Check order status before deleting
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      if (order.delivery_status === 'delivered' || order.delivery_status === 'in delivery') {
        return res.status(400).json({ message: 'Cannot delete order in delivered or in delivery status' });
      }
  
      // Update order status to 'canceled'
      await order.update({ delivery_status: 'canceled' });
  
      // Delete the order
      //await order.destroy();
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



exports.getOrdersByUser= async (req, res) => {
    const { userId } = req.params; // Get user ID from request params

    try {
      // Find orders for the specified user
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          { // Include associated products
            model: OrderProduct,
            as: 'OrderProducts',
            include: [
              { // Include product details
                model: Product,
                as: 'product',
                attributes: [Sequelize.Op.all] // Select all attributes
              }
            ]
          },
          { // Include user details
            model: User,
            as: 'user',
            attributes: [Sequelize.Op.all] // Select all attributes
          }
        ]
      });

      // Format and return the response
      const formattedOrders = orders.map((order) => {
        return {
          orderId: order.id,
          deliveryStatus: order.delivery_status,
          paymentStatus: order.payment_status,
          dateOrder: order.date_order,
          dateCreation: order.date_creation,
          dateUpdate: order.date_update,
          orderStatus: order.order_status,
          userId: order.user_id,
          paymentId: order.payment_id,
          user: order.user, // User details
          products: order.productOrders.map((productOrder) => {
            return {
              productId: productOrder.product_id,
              quantity: productOrder.quantity,
              product: productOrder.product // Product details
            };
          })
        };
      });

      res.status(200).json({ orders: formattedOrders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}



exports.getOrderDetails= async (req, res) => {
    const { orderId } = req.params; // Get order ID from request params

    try {
      // Find the order with the specified ID
      const order = await Order.findByPk(orderId, {
        include: [
          { // Include associated products
            model: ProductOrder,
            as: 'productOrders',
            include: [
              { // Include product details
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'description'] // Select specific product attributes
              }
            ]
          },
          { // Include user details
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'] // Select specific user attributes
          }
        ]
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Format and return the order details
      const orderDetails = {
        orderId: order.id,
        deliveryStatus: order.delivery_status,
        paymentStatus: order.payment_status,
        dateOrder: order.date_order,
        dateCreation: order.date_creation,
        dateUpdate: order.date_update,
        orderStatus: order.order_status,
        userId: order.user_id,
        paymentId: order.payment_id,
        user: order.user, // User details
        products: order.productOrders.map((productOrder) => {
          return {
            productId: productOrder.product_id,
            quantity: productOrder.quantity,
            product: productOrder.product // Product details
          };
        })
      };

      res.status(200).json({ order: orderDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.updateOrder=async (req, res) => {
    const { orderId } = req.params; // Get order ID from request params
    const { deliveryStatus, paymentStatus, orderStatus } = req.body; // Get update data from request body

    try {
      // Find the order to update
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Validate update data (optional)
      // ... (Validation logic here)

      // Update the order
      await order.update({
        delivery_status: deliveryStatus || order.delivery_status,
        payment_status: paymentStatus || order.payment_status,
        order_status: orderStatus || order.order_status
      });

      // Format and return the updated order details
      const updatedOrderDetails = {
        orderId: order.id,
        deliveryStatus: order.delivery_status,
        paymentStatus: order.payment_status,
        dateOrder: order.date_order,
        dateCreation: order.date_creation,
        dateUpdate: order.date_update,
        orderStatus: order.order_status,
        userId: order.user_id,
        paymentId: order.payment_id
      };

      res.status(200).json({ order: updatedOrderDetails });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

