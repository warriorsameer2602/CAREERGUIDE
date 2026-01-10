const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.render('scholarship', {
      title: 'Scholarships - CareerGuide',
      description: 'Browse and apply for scholarships to fund your education journey', // ✅ Added
      currentPage: 'scholarship',
      cssFile: 'scholarship.css',
      jsFile: 'scholarship.js'
    });
  } catch (error) {
    console.error('Scholarship route error:', error);
    res.status(500).render('error', {
      title: '500 - Server Error',
      description: 'An internal server error occurred', // ✅ Added
      currentPage: 'error',
      error: error
    });
  }
});

router.get('/search', (req, res) => {
  res.json({ message: 'Scholarship search API - Coming soon!' });
});

module.exports = router;
