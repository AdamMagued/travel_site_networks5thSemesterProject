// Import required modules
const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const path = require('path');

// Initialize Express app
const app = express();

// MongoDB connection URL and database details
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'myDB';
const collectionName = 'myCollection';

let db;
let collection;

// Connect to MongoDB
// THIS IS THE FIXED LINE:
MongoClient.connect(mongoURL)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    collection = db.collection(collectionName);
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static('public')); // Serve static files from public folder

// Session configuration
app.use(session({
  secret: 'travel-website-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

// ==================== AUTHENTICATION ROUTES ====================

// GET /login - Display login page
app.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});

// POST /login - Handle login submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in database
    const user = await collection.findOne({ username: username, password: password });

    if (user) {
      // Credentials correct - create session and redirect to home
      req.session.username = username;
      res.redirect('/home');
    } else {
      // Credentials incorrect - show error
      res.render('login', {
        error: 'Invalid username or password',
        success: null
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /registration - Display registration page
app.get('/registration', (req, res) => {
  res.render('registration', { error: null });
});

// POST /register - Handle registration submission
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if fields are empty
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return res.render('registration', {
        error: 'Username and password cannot be empty'
      });
    }

    // Check if username already exists
    const existingUser = await collection.findOne({ username: username });

    if (existingUser) {
      return res.render('registration', {
        error: 'Username already exists'
      });
    }

    // Insert new user into database
    await collection.insertOne({
      username: username,
      password: password,
      wantToGo: []
    });

    // Redirect to login with success message
    res.render('login', {
      error: null,
      success: 'Registration successful! Please log in.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.render('registration', {
      error: 'An error occurred. Please try again.'
    });
  }
});

// Logout route (optional but useful)
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ==================== MAIN PAGES ====================

// GET /home - Display home page (requires login)
app.get('/home', requireLogin, (req, res) => {
  res.render('home', { username: req.session.username });
});

// ==================== CATEGORY PAGES ====================

// GET /hiking - Display hiking category page
app.get('/hiking', requireLogin, (req, res) => {
  res.render('hiking', { username: req.session.username });
});

// GET /cities - Display cities category page
app.get('/cities', requireLogin, (req, res) => {
  res.render('cities', { username: req.session.username });
});

// GET /islands - Display islands category page
app.get('/islands', requireLogin, (req, res) => {
  res.render('islands', { username: req.session.username });
});

// ==================== DESTINATION PAGES ====================

// GET /inca - Inca Trail destination
app.get('/inca', requireLogin, (req, res) => {
  res.render('inca', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /inca/add - Add Inca to want-to-go list
app.post('/inca/add', requireLogin, async (req, res) => {
  const destName = 'Inca Trail to Machu Picchu';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('inca', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('inca', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('inca', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /annapurna - Annapurna destination
app.get('/annapurna', requireLogin, (req, res) => {
  res.render('annapurna', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /annapurna/add - Add Annapurna to want-to-go list
app.post('/annapurna/add', requireLogin, async (req, res) => {
  const destName = 'Annapurna Circuit';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('annapurna', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('annapurna', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('annapurna', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /paris - Paris destination
app.get('/paris', requireLogin, (req, res) => {
  res.render('paris', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /paris/add - Add Paris to want-to-go list
app.post('/paris/add', requireLogin, async (req, res) => {
  const destName = 'Paris';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('paris', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('paris', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('paris', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /rome - Rome destination
app.get('/rome', requireLogin, (req, res) => {
  res.render('rome', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /rome/add - Add Rome to want-to-go list
app.post('/rome/add', requireLogin, async (req, res) => {
  const destName = 'Rome';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('rome', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('rome', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('rome', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /bali - Bali destination
app.get('/bali', requireLogin, (req, res) => {
  res.render('bali', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /bali/add - Add Bali to want-to-go list
app.post('/bali/add', requireLogin, async (req, res) => {
  const destName = 'Bali Island';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('bali', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('bali', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('bali', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// GET /santorini - Santorini destination
app.get('/santorini', requireLogin, (req, res) => {
  res.render('santorini', {
    username: req.session.username,
    error: null,
    success: null
  });
});

// POST /santorini/add - Add Santorini to want-to-go list
app.post('/santorini/add', requireLogin, async (req, res) => {
  const destName = 'Santorini Island';
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });

    if (user.wantToGo.includes(destName)) {
      return res.render('santorini', {
        username: username,
        error: 'This destination is already in your want-to-go list',
        success: null
      });
    }

    await collection.updateOne(
      { username: username },
      { $push: { wantToGo: destName } }
    );

    res.render('santorini', {
      username: username,
      error: null,
      success: 'Successfully added to your want-to-go list!'
    });

  } catch (error) {
    console.error('Add to list error:', error);
    res.render('santorini', {
      username: username,
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// ==================== WANT-TO-GO LIST ====================

// GET /wanttogo - Display user's want-to-go list
app.get('/wanttogo', requireLogin, async (req, res) => {
  const username = req.session.username;

  try {
    const user = await collection.findOne({ username: username });
    const wantToGoList = user.wantToGo || [];

    res.render('wanttogo', {
      username: username,
      destinations: wantToGoList
    });

  } catch (error) {
    console.error('Want-to-go list error:', error);
    res.render('wanttogo', {
      username: username,
      destinations: []
    });
  }
});

// ==================== SEARCH ====================

// POST /search - Handle search requests
app.post('/search', requireLogin, async (req, res) => {
  const searchQuery = req.body.Search || '';

  // All destinations with their route names
  const allDestinations = [
    { name: 'Inca Trail to Machu Picchu', route: 'inca' },
    { name: 'Annapurna Circuit', route: 'annapurna' },
    { name: 'Paris', route: 'paris' },
    { name: 'Rome', route: 'rome' },
    { name: 'Bali Island', route: 'bali' },
    { name: 'Santorini Island', route: 'santorini' }
  ];

  if (!searchQuery || searchQuery.trim() === '') {
    return res.render('searchresults', {
      username: req.session.username,
      results: [],
      notFound: false,
      searchQuery: ''
    });
  }

  // Search for destinations containing the search query (case-insensitive)
  const results = allDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.render('searchresults', {
    username: req.session.username,
    results: results,
    notFound: results.length === 0,
    searchQuery: searchQuery
  });
});

// ==================== ROOT ROUTE ====================

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// ==================== START SERVER ====================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Make sure MongoDB is running!');
});