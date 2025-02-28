const aiModel = require('../models/aiModel');

exports.getPage = (req, res) => {
    const user = req.session.user;
    res.render('home', { user });
};

exports.generatePage = async (req, res) => {
    const user = req.session.user;
    const pages = ['Home', 'About', 'Contact'];
    
    const prompts = pages.map(page => `Generate a ${page} page with inline styling. Dont do any linking, not even id linking or href linking. Let all pages be separate`);
    
    try {
        const generatedCodes = await Promise.all(prompts.map(prompt => aiModel.generateWebPageCode(prompt)));
        
        if (generatedCodes.some(code => !code)) {
            return res.render('home', { error: 'Failed to generate code', codes: [], pages, user });
        }

        res.render('result', { codes: generatedCodes, pages, user });
    } catch (error) {
        res.render('home', { error: 'Error generating pages', codes: [], pages, user });
    }
};