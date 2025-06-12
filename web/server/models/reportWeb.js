'use strict';

const mongoose = require('mongoose');

const reportWebSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: [String], required: true },
  incidentDate: { type: Date, required: true },
  evidence: { type: String },
  userId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  level: { type: String, enum: ['low', 'medium', 'high'], required: true },
  reportType: { type: String, enum: ['positive', 'negative'], required: true },
  reportedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReportWeb', reportWebSchema);