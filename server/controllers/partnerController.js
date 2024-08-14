const Partner = require('../models/Partner');

const addPartner = async (req, res) => {
    const { entityName, panNumber, partnerType, firmType, pocName, email, phoneNumber, gstNumber, paymentDetails, hasGst, status } = req.body;
    try {
        const newPartner = new Partner({
            entityName,
            panNumber,
            partnerType,
            firmType,
            pocName,
            email,
            phoneNumber,
            gstNumber,
            paymentDetails,
            hasGst,
            status
        });
        await newPartner.save();
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add partner: ' + error.message });
    }
};

const getPartners = async (req, res) => {
    const { search } = req.query;
    const query = search
        ? {
            $or: [
                { entityName: new RegExp(search, 'i') },
                { partnerId: new RegExp(search, 'i') },
                { panNumber: new RegExp(search, 'i') },
                { phoneNumber: new RegExp(search, 'i') }
            ]
        }
        : {};
    try {
        const partners = await Partner.find(query);
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch partners: ' + error.message });
    }
};

const updatePartner = async (req, res) => {
    const { id } = req.params;
    const { entityName, panNumber, partnerType, firmType, pocName, email, phoneNumber, gstNumber, paymentDetails, hasGst, status } = req.body;
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(id, {
            entityName,
            panNumber,
            partnerType,
            firmType,
            pocName,
            email,
            phoneNumber,
            gstNumber,
            paymentDetails,
            hasGst,
            status
        }, { new: true });
        if (!updatedPartner) {
            return res.status(404).json({ error: 'Partner not found' });
        }
        res.status(200).json(updatedPartner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update partner: ' + error.message });
    }
};

const deletePartner = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPartner = await Partner.findByIdAndDelete(id);
        if (!deletedPartner) {
            return res.status(404).json({ error: 'Partner not found' });
        }
        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete partner: ' + error.message });
    }
};

const updatePartnerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedPartner) {
            return res.status(404).json({ error: 'Partner not found' });
        }
        res.status(200).json(updatedPartner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update partner status: ' + error.message });
    }
};

module.exports = { addPartner, getPartners, updatePartner, deletePartner, updatePartnerStatus };
