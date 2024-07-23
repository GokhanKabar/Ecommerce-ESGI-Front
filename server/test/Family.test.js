const familyController = require('../src/controllers/family.controller');
const { Family } = require('../src/databases/sequelize/models');

jest.mock('../src/databases/sequelize/models', () => ({
    Family: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        save: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Controller des familles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait créer une nouvelle famille', async () => {
        const req = { body: { name: 'Nouvelle Famille', description: 'Description de la famille' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const newFamily = { id: 1, ...req.body };
        Family.create.mockResolvedValue(newFamily);

        await familyController.createFamily(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newFamily);
    });

    it('devrait obtenir toutes les familles', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const families = [{ name: 'Famille 1' }, { name: 'Famille 2' }];
        Family.findAll.mockResolvedValue(families);

        await familyController.getAllFamilies(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(families);
    });

    it('devrait obtenir une famille par ID', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const family = { name: 'Famille 1' };
        Family.findByPk.mockResolvedValue(family);

        await familyController.getFamilyById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(family);
    });

    it('devrait mettre à jour une famille', async () => {
        const req = { params: { id: '123' }, body: { name: 'Famille Mise à Jour' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const family = { id: '123', name: 'Famille Originale', save: jest.fn() };
        Family.findByPk.mockResolvedValue(family);
        family.save.mockResolvedValue({ ...family, name: 'Famille Mise à Jour' });

        await familyController.updateFamily(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Family updated', family: expect.objectContaining({ name: 'Famille Mise à Jour' }) }));
    });

    it('devrait supprimer une famille', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Family.destroy.mockResolvedValue(1);

        await familyController.deleteFamily(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Family deleted' });
    });

    it('devrait obtenir toutes les familles pour l\'administrateur', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const families = [{ name: 'Famille 1' }, { name: 'Famille 2' }];
        Family.findAll.mockResolvedValue(families);

        await familyController.getAllFamiliesAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(families);
    });
});
