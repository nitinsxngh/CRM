const express = require('express');
const router = express.Router();
const { createLead, getAllLeads, getLeadById, updateLeadById, updateLeadPriorityById, updateLeadStatusById, deleteLeadById } = require('../controllers/leadControllers');

// Define the routes
router.post('/', createLead); // POST route for creating a lead
router.get('/', getAllLeads); // GET route for retrieving all leads
router.get('/:id', getLeadById); // GET route for retrieving a lead by ID
router.put('/:id', updateLeadById); // PUT route for updating a lead by ID
router.patch('/:id/priority', updateLeadPriorityById); // PATCH route for updating lead priority by ID
router.patch('/:id/status', updateLeadStatusById); // PATCH route for updating lead status by ID
router.delete('/:id', deleteLeadById); // DELETE route for deleting a lead by ID

module.exports = router;
