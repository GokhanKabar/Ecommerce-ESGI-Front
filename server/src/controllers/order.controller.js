const { Order, ProductOrder, Product, User,sequelize } = require('../databases/sequelize/models');


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
    const orders = await sequelize.query(`
      SELECT ord.id ,CONCAT(u.lastName,' ',u.firstName) as lastName,u.email, ord.delivery_status , ord.payment_status , ord.date_order 
      FROM \`Order\` as ord 
      JOIN product_orders as po on po.order_id = ord.id 
      JOIN products as p on p.id = po.product_id 
      JOIN Users as u ON u.id = ord.user_id
      GROUP BY ord.id, u.id
    `, { type: sequelize.QueryTypes.SELECT });
    res.status(201).json(orders);
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
        orderStatus: order.order_status,
        userId: order.user_id,
        products: order.Products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            concentration: product.concentration,
            promotion: product.promotion,
            image: product.image,
            quantity: product.ProductOrder.quantity,
            totalPrice: product.ProductOrder.quantity * product.price
        }))
    }));
    
      res.status(200).json( OrderDetails );
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

