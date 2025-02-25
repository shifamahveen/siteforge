const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController'); 
const adminController = require('../controllers/adminController'); 
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { csrfToken: req.csrfToken() });
});

router.post('/register', authController.registerUser);

router.get('/login', (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
});

router.post('/login', authController.loginUser);

router.get('/logout', authController.logout);

router.get('/profile', ensureAuthenticated, profileController.getProfile);

router.get('/admin', ensureAuthenticated, adminController.adminPage);

router.get('/forgot', authController.getForgotPage);
router.post('/forgot', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;