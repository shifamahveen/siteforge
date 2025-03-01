const db = require('../config/db');

class Page {
    // Save page
    static async savePage(name, content) {
        try {
            const query = 'INSERT INTO pages (name, content) VALUES (?, ?)';
            const [result] = await db.execute(query, [name, JSON.stringify(content)]);
            return result;
        } catch (error) {
            console.error('Error in savePage:', error);
            throw error;
        }
    }
    

    // Fetch all pages
    static async getPages() {
        try {
            const query = 'SELECT * FROM pages';
            const [rows] = await db.execute(query);
            return rows; // Returns an array of pages
        } catch (error) {
            console.error('Error fetching pages:', error);
            throw error;
        }
    }

    static async getAllPagesWithContent() {
        try {
            const query = 'SELECT id, name, content, created_at FROM pages ORDER BY created_at DESC';
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            console.error('Error fetching pages with content:', error);
            throw error;
        }
    }    

    // ✅ Correctly define getPageById as a static method
    static async getPageById(id) {
        try {
            const query = 'SELECT * FROM pages WHERE id = ?';
            const [rows] = await db.execute(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error(`Error fetching page with ID ${id}:`, error);
            throw error;
        }
    }
}

module.exports = Page;
