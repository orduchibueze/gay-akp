const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const { JWT_SECRET } = process.env;

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.redirect('/');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/profile');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const { JWT_SECRET } = process.env;

const upload = multer({ dest: 'public/uploads/' });

router.get('/', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  const { userId } = jwt.verify(token, JWT_SECRET);
  const user = User.findById(userId);
  res.render('profile', { user });
});

router.post('/upload', upload.single('image'), (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  const { userId } = jwt.verify(token, JWT_SECRET);
  const user = User.findById(userId);
  user.profilePicture = req.file.filename;
  user.save();
  res.redirect('/profile');
});

module.exports = router;


const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Post = require('../models/Post'); // Assuming you have a Post model
const { JWT_SECRET } = process.env;

const upload = multer({ dest: 'public/uploads/' });

router.post('/create', upload.single('media'), (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  const { userId } = jwt.verify(token, JWT_SECRET);
  const post = new Post({ userId, media: req.file.filename, text: req.body.text });
  post.save();
  res.redirect('/profile');
});

router.post('/like/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.redirect('/profile');
});

router.post('/comment/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ text: req.body.text, userId: req.userId });
  await post.save();
  res.redirect('/profile');
});

module.exports = router;
