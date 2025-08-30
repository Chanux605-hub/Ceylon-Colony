const { Router } = require('express');
const { upload } = require('../config/cloudinary'); // CJS
const {
  createPost,
  listShorts,
  addView,
  adminListPosts,
  adminUpdateStatus,
  adminDeletePost,
  adminStats,
} = require('../controllers/postController'); // import all used handlers

const router = Router();

// Public
router.post('/posts', upload.single('media'), createPost);
router.get('/shorts', listShorts);
router.patch('/posts/:id/view', addView);

// Admin (protect with auth later)
router.get('/admin/posts', adminListPosts);
router.patch('/admin/posts/:id', adminUpdateStatus);
router.delete('/admin/posts/:id', adminDeletePost);
router.get('/admin/stats', adminStats);

module.exports = router;
