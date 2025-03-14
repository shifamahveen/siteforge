const db = require('../config/db');

exports.getContactForm = (req, res) => {
    res.render('contact', { user: req.session.user, success: req.query.success });
};

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
        await db.query(sql, [name, email, message]);  // Await ensures query completes before redirecting
        res.redirect('/contact?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.listContacts = async (req, res) => {
    try {
        const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
        const [results] = await db.query(sql);  
        res.render('contacts', { user: req.session.user, contacts: results });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};