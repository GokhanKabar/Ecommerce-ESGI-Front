const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');

// Créer une nouvelle alerte
router.post('/', alertController.createAlert);

// Obtenir toutes les alertes pour un utilisateur
router.get('/:userId', alertController.getAlerts);

// Mettre à jour une alerte
router.put('/:id', alertController.updateAlert);

// Supprimer une alerte
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
