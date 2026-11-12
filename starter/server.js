const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const pagesRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

async function connectToDatabase() {

  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Add it to your .env file.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });

    console.log('Connected to MongoDB (database: blog)');
  } catch (error) {

    console.error('MongoDB connection failed:', error.message);
  }
}

app.locals.publicDir = publicDir;
app.use(express.json());
app.use(express.static(publicDir));

// TODO: Complete the page routes in routes/pages.js.
app.use('/', pagesRouter);

// TODO: Complete the API routes in routes/posts.js.
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).sendFile(path.join(publicDir, '500.html'));
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Mounted routers:');
    console.log('  / -> routes/pages.js');
    console.log('  /api/posts -> routes/posts.js');
  });
});