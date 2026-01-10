const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.render('collegeFinder', {
      title: 'Find Colleges - CareerGuide',
      description: 'Discover government colleges near you with complete admission information', // ✅ Added
      currentPage: 'colleges',
      cssFile: 'collegeFinder.css',
      jsFile: 'collegeFinder.js'
    });
  } catch (error) {
    console.error('College route error:', error);
    res.status(500).render('error', {
      title: '500 - Server Error',
      description: 'An internal server error occurred', // ✅ Added
      currentPage: 'error',
      error: error
    });
  }
});

router.get('/nearby', (req, res) => {
  res.json({ message: 'Nearby colleges API endpoint - Coming soon!' });
});

router.get('/:id', (req, res) => {
  res.render('college-details', {
    title: 'College Details - CareerGuide',
    description: 'Detailed information about college courses, fees, and admission process', // ✅ Added
    currentPage: 'colleges',
    collegeId: req.params.id
  });
});

module.exports = router;
