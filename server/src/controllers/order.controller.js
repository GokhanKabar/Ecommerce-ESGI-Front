const { Order, ProductOrder, Product, User } = require('../databases/sequelize/models');


exports.createOrder= async (req, res) =>{
    try {
        const orde = await Order.create(req.body);
        res.status(201).json(Order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.getAllOrders = async (req, res) => {
  try {
      const allOrders = await Order.findAll({
          attributes: {
              include: [
                  [
                      Sequelize.fn('COUNT', Sequelize.col('Products.id')), 'productCount'
                  ]
              ]
          },
          include: [
              {
                  model: Product,
                  attributes: ['name'], // Include only the product name
                  through: {
                      attributes: [] // Exclude join table attributes
                  }
              },
              {
                  model: User,
                  attributes: ['name', 'prenom', 'telephone', 'email'] // Include specific user attributes
              }
          ],
          group: ['Order.id', 'User.id', 'Products.id'] // Group by Order, User, and Product to get the correct counts
      });

      res.status(200).json(allOrders);
      console.log('allOrdersHere');
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


exports.getOrderById=async(req, res)=>{
    try {
        const order=await Order.findByPk(req.params.id);
        res.status(200).json(order);
        console.log('allOrdersHere')
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.id; 
  
      // Check order status before deleting
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      if (order.delivery_status === 'delivered' || order.delivery_status === 'in_delivery') {
        return res.status(400).json({ message: 'Cannot delete order delivered or in delivery status' });
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



  exports.getOrdersByUser = async (req, res) => {
    const  userId  = req.params.id;
    try {
        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                }
            ]
        });

        if (!orders) {
            return res.status(200).json({ orders: [] });
        }

        const formattedOrders = orders.map(order => ({
          orderId: order.id,
          deliveryStatus: order.delivery_status,
          paymentStatus: order.payment_status,
          dateOrder: order.date_order,
          dateCreation: order.date_creation,
          dateUpdate: order.date_update,
          orderStatus: order.order_status,
          userId: order.user_id,
          products: order.Products.map(product => ({
              id: product.id,
              name: product.name,
              description: product.description,
              category: product.category,
              price: product.price,
              stock: product.stock,
              concentration: product.concentration,
              promotion: product.promotion,
              image: product.image,
              dateAdded: product.dateAdded,
              dateUpdated: product.dateUpdated,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              brandId: product.brandId,
              familyId: product.familyId,
              quantity: product.ProductOrder.quantity,
              totalPrice: product.ProductOrder.quantity * product.price
          }))
      }));
      
        res.status(200).json({  formattedOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



exports.getOrderDetails= async (req, res) => {
  const  orderId  = req.params.id;
  try {
      const orders = await Order.findAll({
          where: { id: orderId },
          include: [
              {
                  model: Product,
              }
          ]
      });

      if (!orders) {
          return res.status(200).json({ orders: [] });
      }

      const OrderDetails = orders.map(order => ({
        orderId: order.id,
        deliveryStatus: order.delivery_status,
        paymentStatus: order.payment_status,
        dateOrder: order.date_order,
        dateCreation: order.date_creation,
        dateUpdate: order.date_update,
        orderStatus: order.order_status,
        userId: order.user_id,
        products: order.Products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            concentration: product.concentration,
            promotion: product.promotion,
            image: product.image,
            dateAdded: product.dateAdded,
            dateUpdated: product.dateUpdated,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            brandId: product.brandId,
            familyId: product.familyId,
            quantity: product.ProductOrder.quantity,
            totalPrice: product.ProductOrder.quantity * product.price
        }))
    }));
    
      res.status(200).json({  OrderDetails });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
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

