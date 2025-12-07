const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');
const RFP = require('../models/RFP'); // Assuming we can link it somehow, or extract ID from subject
const { parseProposal } = require('../utils/ai');

exports.handleInboundEmail = async (req, res) => {
    try {
        // This is a webhook handler. The payload depends on the provider (Mailgun, SendGrid, etc.)
        // For this demo, we assume a generic JSON body with { from, subject, text }
        
        const { from, subject, text } = req.body;
        
        // 1. Identify Vendor
        const vendor = await Vendor.findOne({ email: from });
        if (!vendor) {
            console.log('Vendor not found for email:', from);
            return res.status(200).send('Vendor not found'); // Return 200 to acknowledge webhook
        }

        // 2. Identify RFP (e.g., from Subject "Re: RFP: Title")
        // In a real app, we might use a unique ID in the subject or Reply-To address
        // For now, let's try to find an RFP that matches part of the subject
        // Or assume the subject contains the RFP ID if we put it there.
        // Let's assume the subject is "Re: RFP: <Title>"
        
        // Simplified: Find the most recent RFP sent to this vendor? 
        // Or just search RFPs by title in subject.
        const rfpTitle = subject.replace('Re: RFP: ', '').trim();
        const rfp = await RFP.findOne({ title: new RegExp(rfpTitle, 'i') });
        
        if (!rfp) {
             console.log('RFP not found for subject:', subject);
             return res.status(200).send('RFP not found');
        }

        // 3. Parse Proposal
        const parsedData = await parseProposal(text);

        // 4. Save Proposal
        const proposal = new Proposal({
            rfpId: rfp._id,
            vendorId: vendor._id,
            rawEmailBody: text,
            parsed: parsedData,
            aiSummary: "Pending comparison",
            aiScore: 0
        });

        await proposal.save();
        console.log('Proposal saved for RFP:', rfp.title, 'from:', vendor.name);

        res.status(200).send('Processed');
    } catch (error) {
        console.error('Error handling inbound email:', error);
        res.status(500).send('Error');
    }
};
