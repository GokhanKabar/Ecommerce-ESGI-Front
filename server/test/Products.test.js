const productController = require('../src/controllers/product.controller');
const Product = require('../src/databases/mongoose/Products');
const SequelizeProduct = require('../src/databases/sequelize/models').Product;

jest.mock('../src/databases/mongoose/Products');
jest.mock('../src/databases/sequelize/models', () => ({
    Product: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Contrôleur des produits', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait obtenir tous les produits', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const products = [{ name: 'Produit 1' }, { name: 'Produit 2' }];
        Product.find.mockResolvedValue(products);

        await productController.getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });

    it('devrait obtenir les produits par catégorie', async () => {
        const req = { params: { category: 'cat1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const products = [{ name: 'Produit 1', category: 'cat1' }];
        Product.find.mockResolvedValue(products);

        await productController.getProductsByCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });

    it('devrait obtenir un produit par ID', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const product = { name: 'Produit 1' };
        Product.findById.mockResolvedValue(product);

        await productController.getProductById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(product);
    });

    it('devrait créer un nouveau produit', async () => {
        const req = { body: { name: 'Nouveau Produit', description: 'Description du produit', category: 'cat1', price: 100, stock: 10, concentration: 'concentration', brandId: 'brand1', familyId: 'family1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const newProduct = { id: 1, ...req.body };
        SequelizeProduct.create.mockResolvedValue(newProduct);

        await productController.createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newProduct);
    });

    it('devrait supprimer un produit', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const product = { id: '123', destroy: jest.fn() };
        SequelizeProduct.findByPk.mockResolvedValue(product);
        product.destroy.mockResolvedValue(1);

        await productController.deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('devrait rechercher des produits', async () => {
        const req = { query: { q: 'Produit' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const products = [{ name: 'Produit' }];
        Product.find.mockResolvedValue(products);

        await productController.searchProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
    });
});
