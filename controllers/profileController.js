const userModel = require('../models/userModel');

exports.getProfile = (req, res) => {  
  if (!req.session.user) {
    return res.redirect('/login'); 
  }

  userModel.findUserById(req.session.user.id, (err, user) => {
    if (err) {
      return res.redirect('/login'); 
    }
    
    if (!user) {
      return res.redirect('/login');
    }

    res.render('profile', { user });
  });
};
