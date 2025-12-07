const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    rawEmailBody: { type: String },
    parsed: {
        totalPrice: { type: String },
        itemBreakdown: [{
            name: { type: String },
            price: { type: String },
            quantity: { type: Number }
        }],
        warranty: { type: String },
        delivery: { type: String },
        paymentTerms: { type: String }
    },
    aiSummary: { type: String },
    aiScore: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);
