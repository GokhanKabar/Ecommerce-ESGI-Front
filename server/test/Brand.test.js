const brandController = require('../src/controllers/brand.controller');
const { Brand } = require('../src/databases/sequelize/models');

jest.mock('../src/databases/sequelize/models', () => ({
    Brand: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Controller des marques', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait créer une nouvelle marque', async () => {
        const req = { body: { name: 'Nouvelle Marque', description: 'Description de la marque' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const newBrand = { id: 1, ...req.body };
        Brand.create.mockResolvedValue(newBrand);

        await brandController.createBrand(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newBrand);
    });

    it('devrait obtenir toutes les marques', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const brands = [{ name: 'Marque 1' }, { name: 'Marque 2' }];
        Brand.findAll.mockResolvedValue(brands);

        await brandController.getAllBrands(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brands);
    });

    it('devrait obtenir une marque par ID', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const brand = { name: 'Marque 1' };
        Brand.findByPk.mockResolvedValue(brand);

        await brandController.getBrandById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brand);
    });

    it('devrait mettre à jour une marque', async () => {
        const req = { params: { id: '123' }, body: { name: 'Marque Mise à Jour' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const brand = { id: '123', name: 'Marque Originale', save: jest.fn() };
        Brand.findByPk.mockResolvedValue(brand);
        brand.save.mockResolvedValue({ ...brand, name: 'Marque Mise à Jour' });

        await brandController.updateBrand(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Brand updated', brand: expect.objectContaining({ name: 'Marque Mise à Jour' }) }));
    });

    it('devrait supprimer une marque', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Brand.destroy.mockResolvedValue(1);

        await brandController.deleteBrand(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Brand deleted' });
    });

    it('devrait obtenir toutes les marques pour l\'administrateur', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const brands = [{ name: 'Marque 1' }, { name: 'Marque 2' }];
        Brand.findAll.mockResolvedValue(brands);

        await brandController.getAllBrandsAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(brands);
    });
});
