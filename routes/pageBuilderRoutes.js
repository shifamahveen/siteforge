const express = require('express');
const router = express.Router();
const pageBuilderController = require('../controllers/pageBuilderController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 

router.get('/', ensureAuthenticated, pageBuilderController.getPageBuilder);
router.post('/save', ensureAuthenticated, pageBuilderController.savePage);
router.get('/dashboard', ensureAuthenticated, pageBuilderController.listPages); 
router.get('/page/:id', ensureAuthenticated, pageBuilderController.viewPage);

module.exports = router;