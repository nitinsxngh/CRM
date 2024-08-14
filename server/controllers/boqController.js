const Boq = require('../models/Boq');

// Create a new BOQ
const createBoq = async (req, res) => {
    const boq = new Boq({
        boqName: req.body.boqName,
        customer: req.body.customer,
        boqComments: req.body.boqComments,
        type: req.body.type,
        createdBy: req.body.createdBy,
        additionalInfo: req.body.additionalInfo,
        constructionDetails: req.body.constructionDetails,
        area: req.body.area,
        category: req.body.category,
        items: req.body.items,
        siteInspection: req.body.siteInspection,
        otherCharges: req.body.otherCharges,
        siteConditions: req.body.siteConditions,
        specifications: req.body.specifications
    });

    try {
        const newBoq = await boq.save();
        res.status(201).json(newBoq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all BOQs
const getAllBoqs = async (req, res) => {
    try {
        const boqs = await Boq.find();
        res.json(boqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a BOQ by ID
const getBoqById = async (req, res) => {
    try {
        const boq = await Boq.findById(req.params.id);
        if (!boq) {
            return res.status(404).json({ message: 'BOQ not found' });
        }
        res.json(boq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a BOQ by ID
const updateBoqById = async (req, res) => {
    try {
        const updatedBoq = await Boq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBoq) {
            return res.status(404).json({ message: 'BOQ not found' });
        }
        res.json(updatedBoq);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a BOQ by ID
const deleteBoqById = async (req, res) => {
    try {
        const deletedBoq = await Boq.findByIdAndDelete(req.params.id);
        if (!deletedBoq) {
            return res.status(404).json({ message: 'BOQ not found' });
        }
        res.json({ message: 'BOQ deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createBoq,
    getAllBoqs,
    getBoqById,
    updateBoqById,
    deleteBoqById
};
