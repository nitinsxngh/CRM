const express = require('express');
const { addPartner, getPartners, updatePartner, deletePartner, updatePartnerStatus } = require('../controllers/partnerController');

const router = express.Router();

router.post('/', addPartner);
router.get('/', getPartners);
router.put('/:id', updatePartner);
router.patch('/:id/status', updatePartnerStatus); // Ensure this line is correct
router.delete('/:id', deletePartner);

module.exports = router;
