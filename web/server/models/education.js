'use strict';

const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, default: 'general' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Education', educationSchema);