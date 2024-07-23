// test/Order.test.js
const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  getOrdersByUser,
  getOrderDetails,
  updateOrder,
} = require('../src/controllers/order.controller');
const { Order, Product, User, sequelize } = require('../src/databases/sequelize/models');

jest.mock('../src/databases/sequelize/models');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order and return success', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        payment_intent_id: 'some_id',
        delivery_status: 'confirmed',
        payment_status: 'Payed',
        total: 100,
        date_order: new Date(),
        date_creation: new Date(),
        date_update: new Date(),
        order_status: 'Confirmed',
      };

      Order.create.mockResolvedValue(mockOrder);
      sequelize.query.mockResolvedValue([[], []]); // Mocking the queries

      const req = {
        body: {
          userId: 1,
          products: [
            { productId: 1, price: 50, quantity: 2 },
          ],
          payment_intent_id: 'some_id',
        },
      };

      const res = mockResponse();

      await createOrder(req, res);

      expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 1,
        payment_intent_id: 'some_id',
        total: 100,
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith('success');
    });

    it('should handle errors during order creation', async () => {
      Order.create.mockRejectedValue(new Error('Database error'));

      const req = {
        body: {
          userId: 1,
          products: [
            { productId: 1, price: 50, quantity: 2 },
          ],
          payment_intent_id: 'some_id',
        },
      };

      const res = mockResponse();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getAllOrders', () => {
    
    it('should handle errors during fetching all orders', async () => {
      sequelize.query.mockRejectedValue(new Error('Database error'));
  
      const req = {};
      const res = mockResponse();
  
      await getAllOrders(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
  

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const mockOrder = {
        id: 1,
        user_id: 1,
        total: 100,
      };

      Order.findByPk.mockResolvedValue(mockOrder);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrderById(req, res);

      expect(Order.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle errors during fetching order by ID', async () => {
      Order.findByPk.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order and return success', async () => {
      const mockOrder = {
        id: 1,
        delivery_status: 'pending',
        update: jest.fn().mockResolvedValue(),
      };

      Order.findByPk.mockResolvedValue(mockOrder);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await deleteOrder(req, res);

      expect(Order.findByPk).toHaveBeenCalledWith(1);
      expect(mockOrder.update).toHaveBeenCalledWith({ delivery_status: 'canceled' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order deleted successfully' });
    });

    it('should handle errors during order deletion', async () => {
      Order.findByPk.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getOrdersByUser', () => {
    it('should return all orders for a user', async () => {
      const mockOrders = [
        {
          id: 1,
          delivery_status: 'confirmed',
          payment_status: 'Payed',
          total: 100,
          Products: [
            { id: 1, price: 50, ProductOrder: { quantity: 2 } },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrdersByUser(req, res);

      expect(Order.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: [{ model: Product }],
        order: [['date_order', 'DESC']],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ formattedOrders: expect.any(Array) });
    });

    it('should handle errors during fetching orders by user', async () => {
      Order.findAll.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrdersByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getOrderDetails', () => {
    it('should return order details with products and user info', async () => {
      const mockOrderDetails = [
        {
          id: 1,
          delivery_status: 'confirmed',
          payment_status: 'Payed',
          total: 100,
          order_status: 'Confirmed',
          user_id: 1,
          User: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
          Products: [
            { id: 1, name: 'Product A', price: 50, ProductOrder: { quantity: 2 } },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrderDetails);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrderDetails(req, res);

      expect(Order.findAll).toHaveBeenCalledWith({
        where: { id: 1 },
        include: [{ model: Product }, { model: User, attributes: ['firstName', 'lastName', 'email'] }],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should handle errors during fetching order details', async () => {
      Order.findAll.mockRejectedValue(new Error('Database error'));

      const req = { params: { id: 1 } };
      const res = mockResponse();

      await getOrderDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updateOrder', () => {
   

    it('should handle errors during updating an order', async () => {
      Order.findByPk.mockRejectedValue(new Error('Database error'));

      const req = {
        params: { id: 1 },
        body: { delivery_status: 'delivered' },
      };

      const res = mockResponse();

      await updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
