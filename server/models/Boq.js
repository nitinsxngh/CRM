const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    discount: { type: Number, required: true },
    cost: { type: Number, required: true },
    uploadImage: { type: String } // Assuming you will store the image URL
});

const siteConditionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    uom: { type: String, required: true },
    standard: { type: String, required: true }
});

const specificationSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String } // Assuming you will store the image URL
});

const boqSchema = new mongoose.Schema({
    boqId: { type: String, unique: true, index: true }, // Unique BOQ ID
    boqName: { type: String, required: true },
    customer: { type: String, required: true },
    boqComments: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: String, required: true },
    additionalInfo: { type: String },
    constructionDetails: { type: String },
    area: { type: String },
    category: { type: String },
    items: [itemSchema],
    siteInspection: { type: String, enum: ['Yes', 'No'], required: true },
    otherCharges: { type: String },
    siteConditions: [siteConditionSchema],
    specifications: [specificationSchema]
});

// Pre-save hook to generate the unique BOQ ID
boqSchema.pre('save', async function(next) {
    if (!this.boqId) {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
        
        // Count the documents with similar boqId prefix
        let sequence = await this.constructor.countDocuments({ boqId: new RegExp(`^BID${currentDate}`) });
        sequence++; // Increment sequence for new document
        
        this.boqId = `BID${currentDate}${sequence}`;
    }
    next();
});

const Boq = mongoose.model('Boq', boqSchema);

module.exports = Boq;
