const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('error_msg', 'Please log in to access this page');
    res.redirect('/login');
  }
};

// Dashboard home page
router.get('/', requireAuth, async (req, res) => {
    try {
        // Get fresh user data from database
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/login');
        }
        
        res.render('dashboard', {
            title: 'Dashboard - CareerGuide',
            description: 'Your personal career guidance dashboard',
            currentPage: 'dashboard',
            user: user.getPublicProfile(),
            cssFile: 'dashboard.css',
            jsFile: 'dashboard.js'
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
});

// Profile edit page
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('profile-edit', {
            title: 'Edit Profile - CareerGuide',
            currentPage: 'dashboard',
            user: user.getPublicProfile(),
            cssFile: 'auth.css'
        });
    } catch (error) {
        console.error('Profile edit error:', error);
        req.flash('error_msg', 'Error loading profile');
        res.redirect('/dashboard');
    }
});

// Update profile
router.post('/profile', requireAuth, async (req, res) => {
    try {
        const { fullName, dateOfBirth, phoneNumber, currentClass, gender, state, city, interests, careerGoals } = req.body;
        
        const user = await User.findById(req.session.user.id);
        if (!user) {
            req.flash('error_msg', 'User not found');
            return res.redirect('/login');
        }
        
        // Update profile fields
        user.profile.fullName = fullName;
        user.profile.dateOfBirth = new Date(dateOfBirth);
        user.profile.phoneNumber = phoneNumber;
        user.profile.currentClass = currentClass;
        user.profile.gender = gender;
        user.profile.state = state;
        user.profile.city = city;
        user.profile.interests = interests ? interests.split(',').map(i => i.trim()) : [];
        user.profile.careerGoals = careerGoals;
        
        await user.save();
        
        // Update session
        req.session.user = user.getPublicProfile();
        
        req.flash('success_msg', 'Profile updated successfully!');
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            req.flash('error_msg', messages.join('. '));
        } else {
            req.flash('error_msg', 'Error updating profile');
        }
        
        res.redirect('/dashboard/profile');
    }
});

module.exports = router;
