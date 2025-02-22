# SiteForge: AI Website Builder of Tomorrow  

## 🚀 Introduction  
**SiteForge** is an advanced AI-powered website builder built with **Node.js, Express, Tailwind CSS, and MySQL**. It allows users to **drag & drop HTML elements** onto a canvas, **customize them using a style popup**, and **save pages for later access**. The platform also features **role-based access control** to manage different user permissions.  

## 🎯 Features  
- **Drag & Drop Page Builder** – Select from a variety of HTML elements and arrange them freely.  
- **Style Customization** – Modify styles using an interactive popup with real-time previews.  
- **Save & Revisit Pages** – Store pages in the database and access them anytime.  
- **Role-Based Access Control** – Different user roles with varying permissions.  
- **Responsive UI** – Built with **Tailwind CSS** for a sleek and adaptive design.  

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Frontend:** Tailwind CSS, Alpine.js  
- **Database:** MySQL  
- **Authentication & Roles:** Csurf, Express Session  


## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/yourusername/siteforge.git  
cd siteforge
```

### 2️⃣ Setup Database Credentials
```sh
const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'databasename',
  })
  .promise();

module.exports = db;
```

### 3️⃣ Setup Database
```sh
-- Create the 'users' table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'pages' table
CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    content JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ Start the Server
```sh
node app.js
```
