const express = require('express');
const { loginAdmin, getAdmins } = require('../controllers/adminControllers');
const router = express.Router();
// Define the route for fetching user details by email
router.post('/login', loginAdmin);
router.get('/', getAdmins);

module.exports = router;
