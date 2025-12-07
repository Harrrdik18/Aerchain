const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const { generateRFPFromText, compareProposals } = require('../utils/ai');
const { sendEmail } = require('../utils/email');

exports.createRFP = async (req, res) => {
    try {
        const { text } = req.body;
        const rfpData = await generateRFPFromText(text);
        
        // Create a temporary RFP object or save it directly?
        // Requirement says "Shows structured RFP JSON" then "Save button".
        // So this endpoint might just return the generated JSON for the UI to review.
        // But the route is POST /api/rfps/generate-from-text.
        
        res.json(rfpData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveRFP = async (req, res) => {
    try {
        const rfp = new RFP(req.body);
        await rfp.save();
        res.status(201).json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRFPs = async (req, res) => {
    try {
        const rfps = await RFP.find().sort({ createdAt: -1 });
        res.json(rfps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRFP = async (req, res) => {
    try {
        const rfp = await RFP.findById(req.params.id).populate('selectedVendors');
        if (!rfp) return res.status(404).json({ message: 'RFP not found' });
        res.json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendRFPToVendors = async (req, res) => {
    try {
        const { vendorIds } = req.body;
        const rfp = await RFP.findById(req.params.id);
        
        if (!rfp) return res.status(404).json({ message: 'RFP not found' });

        const vendors = await Vendor.find({ _id: { $in: vendorIds } });
        
        // Update RFP with selected vendors
        rfp.selectedVendors = vendorIds;
        await rfp.save();

        // Send emails
        for (const vendor of vendors) {
            const emailContent = `
                <h1>Request for Proposal: ${rfp.title}</h1>
                <p>${rfp.description}</p>
                <p>Please reply to this email with your proposal.</p>
            `;
            await sendEmail(vendor.email, `RFP: ${rfp.title}`, emailContent);
        }

        res.json({ message: 'RFP sent to vendors' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComparison = async (req, res) => {
    try {
        const proposals = await Proposal.find({ rfpId: req.params.id }).populate('vendorId');
        if (proposals.length === 0) {
            return res.json({ message: 'No proposals found', summary: '', recommendation: '', vendorScores: [] });
        }

        const comparison = await compareProposals(proposals);
        res.json(comparison);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
