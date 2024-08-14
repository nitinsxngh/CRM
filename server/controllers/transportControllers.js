const Transport = require('../models/Transports');

const addTransport = async (req, res) => {
    const { companyName, panNumber, typeOfBusiness, firmType, poc, basicDetails, vehicleDetails, driverInformation } = req.body;

    try {
        // Check for existing transport with the same PAN number
        const existingTransport = await Transport.findOne({ panNumber });
        if (existingTransport) {
            return res.status(400).json({ error: 'A transport with this PAN number already exists.' });
        }

        // Check for existing transport with the same POC phone number
        const existingPocPhone = await Transport.findOne({ 'poc.phone': poc.phone });
        if (existingPocPhone) {
            return res.status(400).json({ error: 'A transport with this POC phone number already exists.' });
        }

        const newTransport = new Transport({
            companyName,
            panNumber,
            typeOfBusiness,
            firmType,
            poc,
            basicDetails,
            vehicleDetails,
            driverInformation
        });

        await newTransport.save();
        res.status(201).json(newTransport);
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            let duplicateField = Object.keys(error.keyValue)[0];
            res.status(400).json({ error: `A transport with this ${duplicateField} already exists.` });
        } else {
            console.error('Failed to add transport:', error);
            res.status(500).json({ error: 'Failed to add transport: ' + error.message });
        }
    }
};

const getTransports = async (req, res) => {
    try {
        const transports = await Transport.find();
        res.status(200).json(transports);
    } catch (error) {
        console.error('Failed to fetch transports:', error);
        res.status(500).json({ error: 'Failed to fetch transports. Please try again later.' });
    }
};

const updateTransport = async (req, res) => {
    const { id } = req.params;
    const { companyName, panNumber, typeOfBusiness, firmType, poc, basicDetails, vehicleDetails, driverInformation } = req.body;
    try {
        const updatedTransport = await Transport.findByIdAndUpdate(id, { companyName, panNumber, typeOfBusiness, firmType, poc, basicDetails, vehicleDetails, driverInformation }, { new: true });
        if (!updatedTransport) {
            return res.status(404).json({ error: 'Transport not found' });
        }
        res.status(200).json(updatedTransport);
    } catch (error) {
        console.error('Failed to update transport:', error);
        res.status(500).json({ error: 'Failed to update transport. Please try again later.' });
    }
};

const deleteTransport = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransport = await Transport.findByIdAndDelete(id);
        if (!deletedTransport) {
            return res.status(404).json({ error: 'Transport not found' });
        }
        res.status(200).json({ message: 'Transport deleted successfully' });
    } catch (error) {
        console.error('Failed to delete transport:', error);
        res.status(500).json({ error: 'Failed to delete transport. Please try again later.' });
    }
};

module.exports = { addTransport, getTransports, updateTransport, deleteTransport };
