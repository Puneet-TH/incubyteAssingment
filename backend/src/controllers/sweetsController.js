const { validationResult } = require('express-validator');
const Sweet = require('../models/Sweet');

const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSweetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    console.error('Get sweet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });

    res.json(sweets);
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity
    });

    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    // Check if sweet exists
    const existing = await Sweet.findById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updated = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update sweet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const purchaseSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity: purchaseQuantity } = req.body;

    // Get current sweet
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({ error: 'Insufficient quantity in stock' });
    }

    const newQuantity = sweet.quantity - purchaseQuantity;

    const updated = await Sweet.findByIdAndUpdate(
      id,
      { quantity: newQuantity },
      { new: true }
    );

    res.json({
      message: 'Purchase successful',
      sweet: updated
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const restockSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantity: restockQuantity } = req.body;

    // Get current sweet
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    const newQuantity = sweet.quantity + restockQuantity;

    const updated = await Sweet.findByIdAndUpdate(
      id,
      { quantity: newQuantity },
      { new: true }
    );

    res.json({
      message: 'Restock successful',
      sweet: updated
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSweets,
  getSweetById,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};
