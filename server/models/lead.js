const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadId: { type: String, unique: true, index: true },
    type: { type: String, required: true },
    interiorType: { type: String },
    subType: { type: String },
    pincode: { type: String, required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    plotSize: { type: String },
    floors: { type: String },
    rooms: { type: String },
    budget: { type: String },
    dayToStart: { type: String },
    extraInfo: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    country: { type: String, default: 'India' },
    city: { type: String, default: 'Gurgaon' },
    state: { type: String, default: 'Haryana' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }, // Add this line
    status: { type: String, enum: ['Active', 'Inactive', 'Boq Sent', 'Deal Closed', 'Meeting Done'], default: 'Active' }, // Add this line
    createdDate: { type: Date, default: Date.now }
});

// Pre-save hook to generate the unique Lead ID
leadSchema.pre('save', async function(next) {
    if (!this.leadId) {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
        let sequence = await this.constructor.countDocuments({ leadId: new RegExp(`^LID${currentDate}`) });
        sequence++;
        this.leadId = `LID${currentDate}${sequence}`;
    }
    next();
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
