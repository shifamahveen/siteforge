const express = require('express');
const router = express.Router();
const pageBuilderController = require('../controllers/pageBuilderController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); 

router.get('/', ensureAuthenticated, pageBuilderController.getPageBuilder);
router.post('/save', ensureAuthenticated, pageBuilderController.savePage);
router.get('/dashboard', ensureAuthenticated, pageBuilderController.listPages); 
router.get('/page/:id', ensureAuthenticated, pageBuilderController.viewPage);
// Edit Page
router.get('/edit/:id', ensureAuthenticated, pageBuilderController.editPage);
router.post('/update/:id', ensureAuthenticated, pageBuilderController.updatePage);

// Delete Page
router.delete('/delete/:id', ensureAuthenticated, pageBuilderController.deletePage);

module.exports = router;