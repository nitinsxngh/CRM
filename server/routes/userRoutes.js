const express = require('express');
const { addUser, getUsers, updateUser, deleteUser, updateUserStatus, getUserPermissions } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth'); // Ensure the middleware is imported

const router = express.Router();

router.post('/', addUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.patch('/:id/status', updateUserStatus);
router.get('/permissions/:email', isAuthenticated, getUserPermissions); // Updated to include email parameter
router.delete('/:id', deleteUser);

module.exports = router;
