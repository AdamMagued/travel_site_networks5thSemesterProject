// Matarawy Start
const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'myDB';
const collectionName = 'myCollection';

let db;
let collection;

MongoClient.connect(mongoURL)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    collection = db.collection(collectionName);
  })
  .catch(error => console.error('MongoDB connection error:', error));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'travel-website-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function requireLogin(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}
// Matarawy End

// Adam Start
app.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await collection.findOne({ username: username, password: password });

    if (user) {
      req.session.username = username;
      res.redirect('/home');
    } else {
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

app.get('/registration', (req, res) => {
  res.render('registration', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      return res.render('registration', {
        error: 'Username and password cannot be empty'
      });
    }

    const existingUser = await collection.findOne({ username: username });

    if (existingUser) {
      return res.render('registration', {
        error: 'Username already exists'
      });
    }

    await collection.insertOne({
      username: username,
      password: password,
      wantToGo: []
    });

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

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
// Adam End

// Ahmed Start
app.get('/home', requireLogin, (req, res) => {
  res.render('home', { username: req.session.username });
});

app.get('/hiking', requireLogin, (req, res) => {
  res.render('hiking', { username: req.session.username });
});

app.get('/cities', requireLogin, (req, res) => {
  res.render('cities', { username: req.session.username });
});

app.get('/islands', requireLogin, (req, res) => {
  res.render('islands', { username: req.session.username });
});

app.get('/inca', requireLogin, (req, res) => {
  res.render('inca', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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
// Shenawy End

// Ahmed Start
app.get('/annapurna', requireLogin, (req, res) => {
  res.render('annapurna', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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
// Shenawy End

// Ahmed Start
app.get('/paris', requireLogin, (req, res) => {
  res.render('paris', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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
// Shenawy End

// Ahmed Start
app.get('/rome', requireLogin, (req, res) => {
  res.render('rome', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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
// Shenawy End

// Ahmed Start
app.get('/bali', requireLogin, (req, res) => {
  res.render('bali', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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
// Shenawy End

// Ahmed Start
app.get('/santorini', requireLogin, (req, res) => {
  res.render('santorini', {
    username: req.session.username,
    error: null,
    success: null
  });
});
// Ahmed End

// Shenawy Start
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

app.post('/search', requireLogin, async (req, res) => {
  const searchQuery = req.body.Search || '';

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
// Shenawy End

// Matarawy Start
app.get('/', (req, res) => {
  res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Make sure MongoDB is running!');
});
// Matarawy End