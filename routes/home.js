const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  try {
    // Handle logout messages from URL parameters (backup method)
    const message = req.query.message;
    const user = req.query.user;
    
    let additional_success_msg = '';
    let additional_error_msg = '';
    
    if (message === 'logout_success' && user) {
      additional_success_msg = `Goodbye, ${decodeURIComponent(user)}! You have been logged out successfully.`;
    } else if (message === 'logout_error') {
      additional_error_msg = 'There was an error logging out. Please try again.';
    }
    
    res.render('home', {
      title: 'CareerGuide - Your Career Compass',
      description: 'Discover the perfect academic path with AI-powered recommendations, explore government colleges, and unlock your future potential.',
      currentPage: 'home',
      user: req.session.user || null,
      cssFile: 'home.css',
      jsFile: 'home.js',
      additional_success_msg: additional_success_msg,
      additional_error_msg: additional_error_msg
    });
  } catch (error) {
    console.error('Home route error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load homepage',
      currentPage: 'error'
    });
  }
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About CareerGuide',
    currentPage: 'about',
    user: req.session.user || null
  });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - CareerGuide',
    currentPage: 'contact',
    user: req.session.user || null
  });
});

// Privacy policy route
router.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy - CareerGuide',
    currentPage: 'privacy',
    user: req.session.user || null
  });
});

// Terms of service route
router.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms of Service - CareerGuide',
    currentPage: 'terms',
    user: req.session.user || null
  });
});

// Help center route
router.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Center - CareerGuide',
    currentPage: 'help',
    user: req.session.user || null
  });
});

module.exports = router;
