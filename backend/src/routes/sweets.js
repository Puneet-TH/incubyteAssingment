const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate, isAdmin } = require('../middleware/auth');
const sweetsController = require('../controllers/sweetsController');

// All routes require authentication
router.use(authenticate);

// Get all sweets
router.get('/', sweetsController.getAllSweets);

// Search sweets
router.get('/search', sweetsController.searchSweets);

// Get single sweet
router.get('/:id', sweetsController.getSweetById);

// Create sweet (protected)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], sweetsController.createSweet);

// Update sweet (protected)
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], sweetsController.updateSweet);

// Delete sweet (admin only)
router.delete('/:id', isAdmin, sweetsController.deleteSweet);

// Purchase sweet
router.post('/:id/purchase', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], sweetsController.purchaseSweet);

// Restock sweet (admin only)
router.post('/:id/restock', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], isAdmin, sweetsController.restockSweet);

module.exports = router;

