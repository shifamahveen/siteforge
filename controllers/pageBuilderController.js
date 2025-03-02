const Page = require('../models/Page');
const db = require('../config/db');
const fs = require("fs");
const path = require("path");

exports.getPageBuilder = async (req, res) => {
    try {
        const pages = await Page.getPages(); // Fetch pages from the database
        res.render('index', { pages, user: req.session.user });
    } catch (err) {
        console.error('Error fetching pages:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.savePage = async (req, res) => {
    try {
        let { name, content } = req.body;

        if (typeof content === 'string') {
            content = JSON.parse(content);  
        }

        if (!name || !content) {
            return res.status(400).json({ message: 'Name and content are required' });
        }

        // Define the uploads directory
        const uploadDir = path.join(__dirname, "../public/uploads");

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Convert long blob/base64 URLs to file paths
        content.forEach(item => {
            if (item.src && (typeof item.src === 'string') && (item.src.startsWith("data:image") || item.src.startsWith("blob:"))) {
                const filename = `uploads/${Date.now()}.jpg`;
                const filePath = path.join(__dirname, `../public/${filename}`);

                const base64Data = item.src.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
                
                item.src = `/${filename}`; // Store relative path
            }
        });

        await Page.savePage(name, content);
        res.status(200).json({ message: 'Page saved successfully' });
    } catch (err) {
        console.error('Error saving page:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.listPages = async (req, res) => {
    try {
        const pages = await Page.getAllPagesWithContent();

        pages.forEach(page => {
            if (typeof page.content === 'string') {
                try {
                    page.content = JSON.parse(page.content);
                } catch (e) {
                    console.error(`Error parsing content for page ${page.id}:`, e);
                }
            }
            page.created_at = page.created_at ? new Date(page.created_at) : null;
        });

        // List of quotes
        const quotes = [
            "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
            "Do what you can, with what you have, where you are. – Theodore Roosevelt",
            "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
            "Opportunities don't happen. You create them. – Chris Grosser",
            "It does not matter how slowly you go as long as you do not stop. – Confucius",
            "Believe you can and you’re halfway there. – Theodore Roosevelt",
            "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
            "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
            "It always seems impossible until it’s done. – Nelson Mandela",
            "Don't be pushed by your problems. Be led by your dreams. – Ralph Waldo Emerson",
            "If you want to achieve greatness stop asking for permission. – Anonymous",
            "You may have to fight a battle more than once to win it. – Margaret Thatcher",
            "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
            "Happiness is not something ready-made. It comes from your own actions. – Dalai Lama",
            "Start where you are. Use what you have. Do what you can. – Arthur Ashe"
        ];

        // Select a random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        res.render('list', { pages, user: req.session.user, quote: randomQuote });
    } catch (err) {
        console.error('Error fetching pages:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM pages WHERE id = ?', [id]); 
        res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting page' });
    }
};

exports.viewPage = async (req, res) => {
    try {
        const pageId = req.params.id;
        const [rows] = await db.execute('SELECT * FROM pages WHERE id = ?', [pageId]);

        if (rows.length === 0) {
            return res.status(404).send('Page not found');
        }

        const page = rows[0];
        if (typeof page.content === "string") {
            page.content = JSON.parse(page.content);
        }

        res.render('page', { page, user: req.session.user });
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).send('Server error');
    }
};