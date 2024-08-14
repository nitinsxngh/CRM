const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String, unique: true }, // Unique user ID
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    permissions: {
        customer: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
        admin: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
        partners: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
        transports: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
        boq: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
        lead: { editor: { type: Boolean, default: false }, viewer: { type: Boolean, default: false } },
    }
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);

            // Generate userId if not already present
            if (!this.userId) {
                const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
                let sequence = await this.constructor.countDocuments({ userId: new RegExp(`^UID${currentDate}`) });
                sequence++; // Increment sequence for new document
                this.userId = `UID${currentDate}${sequence}`;
            }
            
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
