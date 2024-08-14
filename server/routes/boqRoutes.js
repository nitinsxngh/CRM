const express = require('express');
const router = express.Router();
const { createBoq, getAllBoqs, getBoqById, updateBoqById, deleteBoqById } = require('../controllers/boqController');

// Define the routes
router.post('/', createBoq); // POST route for creating a BOQ
router.get('/', getAllBoqs); // GET route for retrieving all BOQs
router.get('/:id', getBoqById); // GET route for retrieving a BOQ by ID
router.put('/:id', updateBoqById); // PUT route for updating a BOQ by ID
router.delete('/:id', deleteBoqById); // DELETE route for deleting a BOQ by ID

module.exports = router;
