const { validationResult } = require('express-validator');
const Car = require('../models/Car');

/**
 * GET /api/cars
 * Public - supports search and filter query params
 */
const getCars = async (req, res, next) => {
  try {
    const { search, category_id, min_price, max_price, available } = req.query;
    const filters = { search, category_id, min_price, max_price, available };

    const cars = await Car.getAll(filters);

    res.json({
      success: true,
      count: cars.length,
      data: { cars },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cars/:id
 * Public
 */
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.getById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, data: { car } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cars
 * Admin only
 */
const createCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { brand, model, year, category_id, daily_price, availability_status, image_url, description } = req.body;
    const car = await Car.create({ brand, model, year, category_id, daily_price, availability_status, image_url, description });

    res.status(201).json({
      success: true,
      message: 'Car added successfully.',
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cars/:id
 * Admin only
 */
const updateCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const car = await Car.update(req.params.id, req.body);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.json({
      success: true,
      message: 'Car updated successfully.',
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cars/:id
 * Admin only
 */
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.delete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.json({
      success: true,
      message: 'Car deleted successfully.',
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/cars/:id/availability
 * Admin only
 */
const updateAvailability = async (req, res, next) => {
  try {
    const { availability_status } = req.body;
    const car = await Car.updateAvailability(req.params.id, availability_status);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.json({
      success: true,
      message: 'Availability updated.',
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, updateAvailability };
