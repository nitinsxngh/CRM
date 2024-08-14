const express = require('express');
const { addTransport, getTransports, updateTransport, deleteTransport } = require('../controllers/transportControllers');

const router = express.Router();

router.post('/', addTransport);
router.get('/', getTransports);
router.put('/:id', updateTransport);
router.delete('/:id', deleteTransport);

module.exports = router;
