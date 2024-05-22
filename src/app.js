require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/post');

// Configure Express to use Mustache for templating
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Use routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Chat route
app.get('/chat', (req, res) => {
  res.render('chat');
});

// Socket.io connection for real-time chat
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
