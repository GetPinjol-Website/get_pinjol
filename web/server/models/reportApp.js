'use strict';

const mongoose = require('mongoose');

const reportAppSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReportApp', reportAppSchema);
