const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 

router.get('/contact', ensureAuthenticated, contactController.getContactForm);
router.post('/contact', ensureAuthenticated, contactController.submitContactForm);
router.get('/contacts', ensureAuthenticated, contactController.listContacts);

module.exports = router;