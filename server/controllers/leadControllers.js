const Lead = require('../models/lead');

// Create a new lead
const createLead = async (req, res) => {
    const lead = new Lead(req.body);

    try {
        const newLead = await lead.save();
        res.status(201).json(newLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all leads
const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a lead by ID
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a lead by ID
const updateLeadById = async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update lead priority by ID
const updateLeadPriorityById = async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, { priority: req.body.priority }, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update lead status by ID
const updateLeadStatusById = async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a lead by ID
const deleteLeadById = async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);
        if (!deletedLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadById,
    updateLeadPriorityById,
    updateLeadStatusById,
    deleteLeadById
};
