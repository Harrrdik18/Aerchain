const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const RFP = require('./models/RFP');
const Proposal = require('./models/Proposal');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Vendor.deleteMany({});
        await RFP.deleteMany({});
        await Proposal.deleteMany({});
        console.log('Cleared existing data');

        // Create Vendors
        const vendors = await Vendor.insertMany([
            {
                name: 'Tech Solutions Inc.',
                email: 'sales@techsolutions.com',
                phone: '123-456-7890',
                categories: ['Electronics', 'IT Hardware']
            },
            {
                name: 'Office Depot Pro',
                email: 'b2b@officedepot.com',
                phone: '987-654-3210',
                categories: ['Office Supplies', 'Furniture']
            },
            {
                name: 'Compute World',
                email: 'contact@computeworld.com',
                phone: '555-123-4567',
                categories: ['Electronics', 'Laptops']
            }
        ]);
        console.log('Vendors created');

        // Create RFPs
        const rfps = await RFP.insertMany([
            {
                title: 'High-Performance Laptops for Engineering',
                description: 'We need 50 MacBook Pro equivalent laptops for our software engineering team. Must have at least 32GB RAM and 1TB SSD.',
                budget: '$150,000',
                deliveryTimeline: '1 Month',
                items: [
                    { name: 'Laptop', quantity: 50, specs: '32GB RAM, 1TB SSD, M2/M3 Chip' }
                ],
                paymentTerms: 'Ne30',
                warranty: '3 Years AppleCare+',
                selectedVendors: [vendors[0]._id, vendors[2]._id],
                createdAt: new Date()
            },
            {
                title: 'Ergonomic Office Chairs',
                description: 'Seeking 100 ergonomic office chairs for the new HQ.',
                budget: '$50,000',
                deliveryTimeline: '2 Weeks',
                items: [
                    { name: 'Ergonomic Chair', quantity: 100, specs: 'Mesh back, adjustable lumbar' }
                ],
                paymentTerms: 'Net60',
                warranty: '5 Years',
                selectedVendors: [vendors[1]._id],
                createdAt: new Date()
            }
        ]);
        console.log('RFPs created');

        // Create Proposals for the Laptop RFP
        await Proposal.insertMany([
            {
                rfpId: rfps[0]._id,
                vendorId: vendors[0]._id, // Tech Solutions
                rawEmailBody: "Hi, we can supply 50 Dell XPS 15s with 32GB RAM and 1TB SSD for $2800 each. Total $140,000. Delivery in 3 weeks. 3 Year Warranty included.",
                parsed: {
                    totalPrice: '$140,000',
                    itemBreakdown: [{ name: 'Dell XPS 15', price: '$2,800', quantity: 50 }],
                    warranty: '3 Years',
                    delivery: '3 Weeks',
                    paymentTerms: 'Net30'
                },
                aiSummary: 'Vendor offers Dell XPS 15 within budget and faster delivery.',
                aiScore: 85
            },
            {
                rfpId: rfps[0]._id,
                vendorId: vendors[2]._id, // Compute World
                rawEmailBody: "Quote for 50 MacBook Pro 16-inch. Unit price $3200. Total $160,000. Available immediately. Standard 1 year warranty.",
                parsed: {
                    totalPrice: '$160,000',
                    itemBreakdown: [{ name: 'MacBook Pro 16', price: '$3,200', quantity: 50 }],
                    warranty: '1 Year',
                    delivery: 'Immediate',
                    paymentTerms: 'Prepaid'
                },
                aiSummary: 'Vendor offers MacBook Pros but exceeds budget and has lower warranty.',
                aiScore: 70
            }
        ]);
        console.log('Proposals created');

        console.log('Database populated successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
