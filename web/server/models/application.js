'use strict';

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['web', 'app'], required: true },
  lowCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  highCount: { type: Number, default: 0 },
  recommendation: { 
    type: String, 
    enum: ['Baik', 'Cukup Baik', 'Tidak Direkomendasikan', 'Belum Diketahui'],
    default: 'Belum Diketahui'
  },
  recommendationStatus: { 
    type: String, 
    enum: ['green', 'yellow', 'red', 'grey'],
    default: 'grey'
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);