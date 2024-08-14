const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, deleteCustomer, updateCustomerStatus } = require('../controllers/customerController');

router.post('/', createCustomer);
router.get('/', getCustomers);
router.delete('/:id', deleteCustomer);
router.patch('/:id/status', updateCustomerStatus); // Ensure this route matches

module.exports = router;