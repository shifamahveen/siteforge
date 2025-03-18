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
function saveVideo(base64Video) {
    const filename = `uploads/${Date.now()}.mp4`;
    const filePath = path.join(__dirname, `../public/${filename}`);
    const base64Data = base64Video.replace(/^data:video\/\w+;base64,/, "");
    
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    return `/${filename}`; // Return shortened URL
}

exports.savePage = async (req, res) => {
    try {
        let { name, content } = req.body;

        if (typeof content === "string") {
            content = JSON.parse(content);
        }

        if (!name || !content) {
            return res.status(400).json({ message: "Name and content are required" });
        }

        const uploadDir = path.join(__dirname, "../public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        let formattedContent = content.map(item => {
            if (typeof item === "string") {
                return { type: "text", content: item };
            }

            if (item.type === "grid grid-cols-12 gap-2 w-full") {
                if (typeof item.content === "string") {
                    try {
                        item.content = JSON.parse(item.content);
                    } catch (err) {
                        console.error("Invalid grid format:", err);
                        item.content = [];
                    }
                }
                item.content = Array.isArray(item.content) ? item.content.map(col => ({
                    type: col.type,
                    styles: col.styles || "",
                    content: col.content || []
                })) : [];
            }

            // Convert and shorten Image URLs
            if (item.type === "image" && item.src && typeof item.src === "string" && item.src.startsWith("data:image")) {
                const filename = `uploads/${Date.now()}.jpg`;
                const filePath = path.join(__dirname, `../public/${filename}`);
                const base64Data = item.src.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
                item.src = `/${filename}`;
            }

            // ✅ Convert and Shorten Video URLs
            if (item.type === "video" && item.src && typeof item.src === "string" && item.src.startsWith("data:video")) {
                const fileExt = item.src.match(/^data:video\/(\w+);base64,/)[1] || "mp4";
                const shortFileName = `${crypto.randomUUID()}.${fileExt}`; // Generate unique file name
                const filePath = path.join(__dirname, `../public/uploads/${shortFileName}`);
                const base64Data = item.src.replace(/^data:video\/\w+;base64,/, "");
                fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
                item.src = `/uploads/${shortFileName}`; // Store only the short URL
            }

            return {
                type: item.type,
                styles: item.styles || "",
                content: item.content || item.src || ""
            };
        });

        await Page.savePage(name, formattedContent);

        res.status(200).json({ message: "Page saved successfully" });
    } catch (err) {
        console.error("Error saving page:", err);
        res.status(500).json({ message: "Internal Server Error" });
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

        // Ensure grids are properly formatted for display
        page.content = page.content.map(item => {
            if (item.type.startsWith("grid grid-cols-12") && Array.isArray(item.content)) {
                return {
                    ...item,
                    content: item.content.map(colContent => {
                        if (typeof colContent === 'object' && colContent.type) {
                            return {
                                ...colContent,
                                type: `col-span-${parseInt(colContent.type.replace("col-span-", ""), 10)}`
                            };
                        }
                        return colContent;
                    })
                };
            }
            return item;
        });

        res.render('page', { page, user: req.session.user });
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).send('Server error');
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

exports.editPage = async (req, res) => {
    try {
        const page = await Page.getPageById(req.params.id);
        if (!page) {
            return res.status(404).send("Page not found");
        }

        if (typeof page.content === "string") {
            page.content = JSON.parse(page.content);
        }

        res.render('edit', { page, user: req.session.user });
    } catch (error) {
        console.error("Error fetching page:", error);
        res.status(500).send("Internal Server Error");
    }
};


// Update page
exports.updatePage = async (req, res) => {
    try {
        const { name, content } = req.body;
        await Page.updatePage(req.params.id, name, JSON.parse(content));
        res.redirect('/');
    } catch (error) {
        console.error("Error updating page:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.deletePage = async (req, res) => {
    try {
        const result = await Page.deletePage(req.params.id);
        res.json({ message: "Page deleted successfully" });
    } catch (error) {
        console.error("Error deleting page:", error);
        res.status(500).json({ message: "Error deleting page" });
    }
};