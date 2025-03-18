const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const pageBuilderRoutes = require('./routes/pageBuilderRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ✅ If using express.json(), increase the limit there as well
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use(express.json()); // Ensure the body is being parsed as JSON

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || '3e6166a76a331d65fb41187d070a0dc2d577cf7c755bbdac547aad8d4f7223e3', // Replace with your generated key
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
    },
  })
);

// Middleware to make username available to all views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

// Middleware to expose CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', pageBuilderRoutes);
app.use('/ai', aiRoutes);
app.use('/', contactRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
