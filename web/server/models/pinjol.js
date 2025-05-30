'use strict';

const mongoose = require('mongoose');

const pinjolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  prediction: { type: String, enum: ['recommended', 'not recommended'], required: true },
  riskScore: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pinjol', pinjolSchema);
