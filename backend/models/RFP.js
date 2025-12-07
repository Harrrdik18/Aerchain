const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String },
    deliveryTimeline: { type: String },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        specs: { type: String }
    }],
    paymentTerms: { type: String },
    warranty: { type: String },
    selectedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RFP', rfpSchema);
