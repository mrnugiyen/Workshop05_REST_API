const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /api/posts → create a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts → list all posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/posts/:id → get one post
router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/posts/:id → update a post
router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated document, not the old one
      runValidators: true  // apply the schema rules (required, trim) on update too
    });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/posts/:id → delete a post
router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;