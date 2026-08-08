const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Please add a complaint description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Technical', 'Billing', 'Service', 'Product', 'Other'],
      default: 'Other',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    statusHistory: [StatusHistorySchema],
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);
