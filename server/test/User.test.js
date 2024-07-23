const { register, login, confirmEmail, resetPassword,getAllUsers,getUserById,deleteUser ,updateUser } = require('../src/controllers/userController');
const db = require('../src/databases/sequelize/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

jest.mock('../src/databases/sequelize/models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('randomToken')
  })
}));

describe('Inscription Utilisateur', () => {
  let mockTransporter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransporter = {
      sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
        callback(null, { response: 'Réponse de succès simulée' });
      }),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
  });

  it('devrait inscrire un nouvel utilisateur', async () => {
    db.User.count.mockResolvedValue(0);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    db.User.create.mockResolvedValue({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    });

    const result = await register(
      'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', '0123456789', 'USER', true
    );

    expect(result).toHaveProperty('id');
    expect(db.User.count).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('ValidPass123!', 10);
    expect(db.User.create).toHaveBeenCalled();
    expect(mockTransporter.sendMail).toHaveBeenCalled();
  });

  it('devrait lancer une erreur si l\'email existe déjà', async () => {
    db.User.count.mockResolvedValue(1);

    try {
      await register(
        'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', '0123456789', 'USER', true
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Cet email existe déjà');
    }
  });

  it('devrait lancer une erreur pour un format de mot de passe invalide', async () => {
    db.User.count.mockResolvedValue(0);

    try {
      await register(
        'John', 'Doe', 'short', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', '0123456789', 'USER', true
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toContain('Le mot de passe doit contenir au moins une lettre minuscule');
    }
  });

  it('devrait lancer une erreur pour un format d\'email invalide', async () => {
    db.User.count.mockResolvedValue(0);

    try {
      await register(
        'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'invalid-email', '0123456789', 'USER', true
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toContain('L\'e-mail doit être une adresse e-mail valide');
    }
  });

  it('devrait lancer une erreur pour un format de téléphone invalide', async () => {
    db.User.count.mockResolvedValue(0);

    try {
      await register(
        'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', 'invalid-phone', 'USER', true
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toContain('Le numéro de téléphone doit être un numéro valide');
    }
  });

  it('devrait lancer une erreur si la création de l\'utilisateur échoue', async () => {
    db.User.count.mockResolvedValue(0);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    db.User.create.mockRejectedValue(new Error('Erreur de base de données'));

    try {
      await register(
        'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', '0123456789', 'USER', true
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error.message).toBe('Erreur de base de données');
    }
  });

  it('devrait gérer le cas où rgpdChecked est false', async () => {
    try {
      await register(
        'John', 'Doe', 'ValidPass123!', '123 Rue de Test, Paris, 75001', 'john.doe@example.com', '0123456789', 'USER', false
      );
      throw new Error('La fonction register n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Vous devez accepter la politique de gestion des données personnelles.');
    }
  });
});

describe('Connexion Utilisateur', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait connecter un utilisateur avec un mot de passe correct', async () => {
    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      lastPasswordChange: new Date(),
      accountConfirmation: true,
      lockedUntil: null,
      failedLoginAttempts: 0,
      update: jest.fn(),
      save: jest.fn()
    };

    bcrypt.compare.mockResolvedValue(true);
    db.User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue('jwtToken');

    const result = await login('john.doe@example.com', 'ValidPass123!');

    expect(result).toHaveProperty('token');
    expect(jwt.sign).toHaveBeenCalled();
  }, 10000); // augmenter le délai d'attente à 10 secondes

  it('devrait rejeter si le mot de passe est incorrect', async () => {
    const user = {
      id: 1,
      password: 'hashedPassword',
      accountConfirmation: true,
      createdAt: new Date(),
      lastPasswordChange: new Date(),
      update: jest.fn(),
      save: jest.fn()
    };

    bcrypt.compare.mockResolvedValue(false);
    db.User.findOne.mockResolvedValue(user);

    try {
      await login('john.doe@example.com', 'InvalidPass');
      throw new Error('La fonction login n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Adresse email invalide ou mot de passe incorrect');
    }
  });


  it('devrait rejeter si l\'email est incorrect ou non confirmé', async () => {
    db.User.findOne.mockResolvedValue(null); 

    try {
      await login('invalid.email@example.com', 'ValidPass123!');
      throw new Error('La fonction login n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Adresse email invalide ou mot de passe incorrect');
    }
  });

  it('devrait rejeter si la récupération de l\'utilisateur échoue', async () => {
    db.User.findOne.mockRejectedValue(new Error('Erreur de base de données'));

    try {
      await login('john.doe@example.com', 'ValidPass123!');
      throw new Error('La fonction login n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error.message).toBe('Erreur de base de données');
    }
  });
});

describe('Confirmation Email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rejeter si l\'utilisateur n\'est pas trouvé', async () => {
    db.User.findOne.mockResolvedValue(null);

    try {
      await confirmEmail('john.doe@example.com', 'invalidToken');
      throw new Error('La fonction confirmEmail n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Lien de confirmation invalide'); // Ajuster ici
    }
  });

  it('devrait rejeter si le token est invalide ou expiré', async () => {
    const user = {
      emailToken: 'validToken',
      emailTokenExpiration: new Date(Date.now() - 3600000), // Token expiré
      update: jest.fn(),
    };

    db.User.findOne.mockResolvedValue(user);

    try {
      await confirmEmail('john.doe@example.com', 'validToken');
      throw new Error('La fonction confirmEmail n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('Le lien de confirmation a expiré'); // Ajuster ici
    }
  });
});

describe('resetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rejeter si la validation des données échoue (mot de passe trop court)', async () => {
    await expect(resetPassword('short', 'short', 'validToken'))
      .rejects
      .toBe('Validation des données échouée');
  });

  it('devrait rejeter si la validation des données échoue (mots de passe ne correspondent pas)', async () => {
    await expect(resetPassword('newPassword123', 'differentPassword123', 'validToken'))
      .rejects
      .toBe('Validation des données échouée');
  });

});


describe('getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait récupérer tous les utilisateurs non supprimés', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', deleted: false },
      { id: 2, name: 'Jane Doe', deleted: false }
    ];

    db.User.findAll.mockResolvedValue(mockUsers);

    const users = await getAllUsers();

    expect(users).toEqual(mockUsers);
    expect(db.User.findAll).toHaveBeenCalledWith({
      where: { deleted: false }
    });
  });

  it('devrait lancer une erreur si la récupération des utilisateurs échoue', async () => {
    const errorMessage = 'Erreur de base de données';
    db.User.findAll.mockRejectedValue(new Error(errorMessage));

    try {
      await getAllUsers();
      throw new Error('La fonction getAllUsers n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      // Adapter ici pour le message d'erreur attendu
      expect(error.message).toBe(errorMessage);
    }
  });
  describe('getUserById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('devrait récupérer un utilisateur par ID avec succès', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
  
      db.User.findByPk.mockResolvedValue(mockUser);
  
      const user = await getUserById(1);
  
      expect(user).toEqual(mockUser);
      expect(db.User.findByPk).toHaveBeenCalledWith(1);
    });
  
    it('devrait rejeter si l\'utilisateur n\'est pas trouvé', async () => {
      db.User.findByPk.mockResolvedValue(null);
  
      try {
        await getUserById(999); // ID qui n'existe pas
        throw new Error('La fonction getUserById n\'a pas rejeté l\'erreur attendue');
      } catch (error) {
        expect(error).toBe('User not found');
      }
    });
  
    it('devrait rejeter si la récupération de l\'utilisateur échoue', async () => {
      const errorMessage = 'Erreur de base de données';
      db.User.findByPk.mockRejectedValue(new Error(errorMessage));
  
      try {
        await getUserById(1);
        throw new Error('La fonction getUserById n\'a pas rejeté l\'erreur attendue');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

});

describe('deleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait supprimer un utilisateur avec succès', async () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test St',
      email: 'john.doe@example.com',
      phone: '0123456789',
      password: 'hashedPassword',
      role: 'USER',
      accountConfirmation: true,
      emailToken: 'token',
      emailTokenExpiration: new Date(),
      resetToken: 'resetToken',
      resetTokenExpiration: new Date(),
      failedLoginAttempts: 1,
      lastPasswordChange: new Date(),
      lockedUntil: new Date(),
      deleted: false,
      save: jest.fn().mockResolvedValue(),
    };

    db.User.findByPk.mockResolvedValue(mockUser);
    jwt.verify.mockImplementation(() => ({ id: 1 }));

    await deleteUser(1, 'USER', 'validToken');

    expect(db.User.findByPk).toHaveBeenCalledWith(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.firstName).toContain('deleted_user_');
    expect(mockUser.email).toContain('@example.com');
    expect(mockUser.deleted).toBe(true);
  });

  it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
    db.User.findByPk.mockResolvedValue(null);

    try {
      await deleteUser(1, 'USER', 'validToken');
      throw new Error('La fonction deleteUser n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error).toBe('User not found');
    }
  });

  it('devrait rejeter en cas d\'erreur lors de la sauvegarde de l\'utilisateur', async () => {
    const mockUser = {
      id: 1,
      save: jest.fn().mockRejectedValue(new Error('Erreur de sauvegarde')),
    };

    db.User.findByPk.mockResolvedValue(mockUser);
    jwt.verify.mockImplementation(() => ({ id: 1 }));

    try {
      await deleteUser(1, 'USER', 'validToken');
      throw new Error('La fonction deleteUser n\'a pas rejeté l\'erreur attendue');
    } catch (error) {
      expect(error.message).toBe('Erreur de sauvegarde');
    }
  });
});
