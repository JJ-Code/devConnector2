const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');


// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//console.log("I ran".red);

//Routes files
const profile = require('./routes/api/profile');
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');

//initatlize express
const app = express();

// Init Middleware -vBody parser
app.use(express.json());

//Mount routers
app.use('/api/profile', profile);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/posts', posts);


//Test Route
app.get('/', (req, res) => res.send('api running'));




//port info
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV}  mode on port ${PORT}!`.yellow.bold);
});


// Handle unhandled promise rejections for all 
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});