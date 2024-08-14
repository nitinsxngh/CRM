const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: { type: String, unique: true },
    companyName: { type: String, required: true },
    panNumber: { type: String, required: true, unique: true },
    typeOfBusiness: { type: String, required: true },
    firmType: { type: String, required: true },
    poc: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true }
    },
    basicDetails: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    hasGst: { type: Boolean, default: false },
    gstNumber: { type: String },
    paymentDetails: {
        paymentType: { type: String, required: true },
        creditTimePeriod: { type: String, required: true },
        creditAmountPercentage: { type: String, required: true },
        creditAmount: { type: String, required: true },
        paymentMode: { type: String, required: true },
        amountPaid: { type: String, required: true },
        comments: { type: String, required: true }
    },
    stagesOfPaymentOrWorkDone: { type: Array, default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' } // Add status field
});

customerSchema.pre('save', async function(next) {
    try {
        if (!this.customerId) { // Check if customerId needs to be generated
            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
            let sequence = await this.constructor.countDocuments({ customerId: new RegExp(`^CID${currentDate}`) });
            sequence++; // Increment sequence for new document
            this.customerId = `CID${currentDate}${sequence}`;
        }

        const existingCustomer = await this.constructor.findOne({ customerId: this.customerId });
        if (existingCustomer && !existingCustomer._id.equals(this._id)) {
            console.log(`Duplicate customerId found: ${this.customerId}`);
            throw new Error(`Duplicate customerId: ${this.customerId}`);
        }

        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
