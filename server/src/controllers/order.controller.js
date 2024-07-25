const {
  Order,
  ProductOrder,
  Product,
  User,
  sequelize,
} = require("../databases/sequelize/models");

exports.createOrder = async (data) => {
  try {
    // Extraire les données de la requête
    const { userId, items, total, name, address } = data.metadata;
    const itemsParse = JSON.parse(items);

    // Créer la commande
    const order = await Order.create({
      user_id: userId,
      delivery_status: "confirmed",
      payment_status: "Payed",
      total: total,
      date_order: new Date(),
      date_creation: new Date(),
      date_update: new Date(),
      order_status: "Confirmed",
      order_user_name: name,
      order_address: address,
    });

    // Ajouter les produits à la commande
    for (const product of itemsParse) {
      const sql = `
      INSERT INTO product_orders (product_id, order_id, quantity, date_create, user_create, user_update)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;

      await sequelize.query(sql, {
        replacements: [
          product.productId,
          order.id,
          product.quantity,
          userId,
          userId,
        ],
        type: sequelize.QueryTypes.INSERT,
      });

      // Mettre à jour la quantité des produits dans la table des produits
      const updateSql = `
      UPDATE products
      SET stock = stock - ?
      WHERE id = ?
    `;

      await sequelize.query(updateSql, {
        replacements: [product.quantity, product.productId],
        type: sequelize.QueryTypes.UPDATE,
      });
    }
    return order.id;
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await sequelize.query(
      `
      SELECT ord.id, CONCAT(u.lastName, ' ', u.firstName) as fullName, u.email, ord.delivery_status as deliveryStatus, ord.payment_status as paymentStatus, ord.date_order as dateOrder
      FROM \`Order\` as ord 
      JOIN product_orders as po on po.order_id = ord.id 
      JOIN products as p on p.id = po.product_id 
      JOIN Users as u ON u.id = ord.user_id
      GROUP BY ord.id, u.id
      ORDER BY date_order DESC
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Mapping to change field names and ensure order
    const mappedOrders = orders.map((order) => ({
      numéro: order.id,
      client: order.fullName,
      email: order.email,
      livraison: order.deliveryStatus,
      paiement: order.paymentStatus,
      date: order.dateOrder,
    }));

    res.status(201).json(mappedOrders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check order status before deleting
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.delivery_status === "delivered" ||
      order.delivery_status === "in_delivery"
    ) {
      return res.status(400).json({
        message: "Cannot delete order delivered or in delivery status",
      });
    }

    // Update order status to 'canceled'
    await order.update({ delivery_status: "canceled" });

    // Delete the order
    //await order.destroy();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
        },
      ],
      order: [["date_order", "DESC"]],
    });

    if (!orders) {
      return res.status(200).json({ orders: [] });
    }

    const formattedOrders = orders.map((order) => ({
      orderId: order.id,
      deliveryStatus: order.delivery_status,
      paymentStatus: order.payment_status,
      total: order.total,
      dateOrder: order.date_order,
      dateCreation: order.date_creation,
      dateUpdate: order.date_update,
      orderStatus: order.order_status,
      userId: order.user_id,
      products: order.Products.map((product) => ({
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
        totalPrice: product.ProductOrder.quantity * product.price,
      })),
    }));

    res.status(200).json({ formattedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.id;
  try {
    const orders = await Order.findAll({
      where: { id: orderId },
      include: [
        {
          model: Product,
        },
        {
          model: User,
          attributes: ["firstName", "lastName", "email","address"], // Sélectionnez les champs que vous voulez récupérer
        },
      ],
    });

    if (!orders) {
      return res.status(200).json({ orders: [] });
    }

    const OrderDetails = orders.map((order) => ({
      orderId: order.id,
      deliveryStatus: order.delivery_status,
      paymentStatus: order.payment_status,
      total: order.total,
      dateOrder: order.date_order,
      orderStatus: order.order_status,
      userId: order.user_id,
      customerName: `${order.User.firstName} ${order.User.lastName}`,
      customerEmail: order.User.email,
      orderUserName: order.order_user_name,
      orderAddress: order.order_address,
      address:order.order_address,
      products: order.Products.map((product) => ({
        orderId: order.id,
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discountedPrice: (
          product.price -
          (product.price * product.promotion) / 100
        ).toFixed(2),
        concentration: product.concentration,
        promotion: product.promotion,
        image: product.image,
        quantity: product.ProductOrder.quantity,
        totalPrice: (
          (
            product.price -
            (product.price * product.promotion) / 100
          ).toFixed(2) * product.ProductOrder.quantity  ),
      })),
    }));

    res.status(200).json(OrderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  const { id: orderId } = req.params; // Get order ID from request params
  const { delivery_status, payment_status, order_status } = req.body; // Get update data from request body
  try {
    // Find the order to update
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate update data (optional)
    // ... (Validation logic here)

    // Update the order
    await order.update({
      delivery_status: delivery_status || order.delivery_status,
      payment_status: payment_status || order.payment_status,
      order_status: order_status || order.order_status,
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
      paymentId: order.payment_id,
    };

    res.status(200).json({ order: updatedOrderDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
