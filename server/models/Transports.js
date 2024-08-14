const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    transportId: { type: String, unique: true, index: true }, // Unique Transport ID
    companyName: { type: String, required: true },
    panNumber: { type: String, required: true, unique: true },
    typeOfBusiness: { type: String },
    firmType: { type: String, required: true },
    poc: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true } // Ensure phone is unique and required
    },
    basicDetails: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    vehicleDetails: [
        {
            vehicleNumber: { type: String, required: true },
            vehicleType: { type: String, required: true },
            capacity: { type: Number, required: true },
            documents: { type: String }
        }
    ],
    driverInformation: {
        driversName: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        operationsDocuments: { type: String }
    }
});

// Pre-save hook to generate the unique Transport ID (transportId)
transportSchema.pre('save', async function(next) {
    if (!this.transportId) {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
        
        // Count the documents with similar transportId prefix
        let sequence = await this.constructor.countDocuments({ transportId: new RegExp(`^TRANSPORT${currentDate}`) });
        sequence++; // Increment sequence for new document
        
        this.transportId = `TRANSPORT${currentDate}${sequence}`;
    }
    next();
});

const Transport = mongoose.model('Transport', transportSchema);

module.exports = Transport;
