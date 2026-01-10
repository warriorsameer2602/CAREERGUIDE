const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// MongoDB and Authentication imports
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize Google Generative AI with Gemini 2.5 Flash
const genAI = new GoogleGenerativeAI("AIzaSyDJQvVlpZR7xOsCLMlrDYo6LLlpvEpGZWA");

// Configure Gemini 2.5 Flash with optimized settings
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
    },
    systemInstruction: "You are an expert AI Career Guidance Counselor for Indian students. Provide concise, practical, and actionable career advice."
});

// MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sih2025_careerguide',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24, // 1 day
});

store.on('error', function(error) {
  console.error('Session store error:', error);
});

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Updated Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'careerguide_secret_key_change_in_production',
  resave: false,
  saveUninitialized: false,
  store: store, // Use MongoDB store
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  res.locals.currentPage = req.path.split('/')[1] || 'home';
  next();
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('error_msg', 'Please log in to access this page');
    res.redirect('/login');
  }
};

// Enhanced AI Career Chat API Route with Gemini 2.5 Flash
app.post('/api/career-chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        console.log('🤖 Received message:', message);
        console.log('🧠 Using Gemini 2.5 Flash');
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build conversation history for Gemini 2.5 Flash
        const conversationHistory = [...history];
        
        // Enhanced career guidance prompt for Gemini 2.5 Flash
        if (conversationHistory.length === 0) {
            conversationHistory.push({
                role: 'user',
                parts: [{
                    text: `You are an expert AI Career Guidance Counselor exclusively focused on career and educational advice for Indian students. You are enthusiastic, inspiring, and comprehensive in showcasing ALL career possibilities - from traditional to cutting-edge modern paths.

🚫 STRICT SCOPE LIMITATION:
When users ask questions OUTSIDE career guidance context (like coding problems, physics concepts, mathematical solutions, technical tutorials, general knowledge, etc.), respond with:

"Sorry, I can only help with career-related questions as I am specifically trained for career guidance. Please ask me about:

Career options and paths

Educational choices and streams

Skills development for careers

Job market insights

College and course recommendations

Career planning and roadmap

How can I help you with your career guidance today?"

📊 QUIZ RESULTS ANALYSIS:
When users share career assessment quiz results (phrases like "Here are my quiz results", "My career test results", "Based on my assessment"), immediately:

Analyze the results comprehensively

Provide specific career recommendations based on scores

Create detailed roadmap with timelines and action steps

Suggest relevant courses, certifications, and institutions

Include both traditional and modern career options

Mention specific salary ranges and growth prospects

🎓 TRADITIONAL CAREER EXCELLENCE:
Engineering (IIT, NIT, State colleges) with specializations in CS, EE, Mechanical, Civil, Chemical

Medical sciences (AIIMS, JIPMER, State medical colleges) - MBBS, BDS, BAMS, BHMS, Nursing

Law (NLUs, private law colleges) - Corporate law, Litigation, Judicial services

Commerce & Finance - CA, CS, CMA, Investment Banking, Financial Analysis

Government services - UPSC, State PSC, Banking (SBI PO, IBPS), Railways, Defence

Teaching & Academia - School teaching, University professor, Research scholar

Architecture, Pharmacy, Agriculture, Veterinary Sciences

🚀 MODERN & EMERGING CAREER OPPORTUNITIES:
Creative & Digital Economy:
Music Production & DJing: Like Alan Walker, Nucleya - Market size: ₹15,000 crores globally, growing 20% annually

Content Creation: YouTube (1000+ channels earn ₹1 lakh+/month), Instagram, TikTok - Creator economy worth $104 billion

Video Editing & Motion Graphics: Demand growing 300% with OTT platforms, average salary ₹8-25 LPA

Photography (Wedding, Fashion, Commercial): Wedding photography alone ₹50,000 crores market

Gaming & Esports: India's gaming market ₹13,600 crores, professional gamers earning ₹5-50 lakhs annually

Game Development: Unity, Unreal Engine developers earning ₹8-30 LPA, indie games potential millions

Live Streaming: Twitch, YouTube Gaming - Top streamers earning ₹10-100 lakhs annually

Tech & Innovation:
App Development: Flutter, React Native - Freelancers earning ₹50,000-5 lakhs per project

AI/ML Engineering: Average salary ₹12-40 LPA, demand growing 200% annually

Cybersecurity: Critical shortage, salaries ₹8-50 LPA, 100% job guarantee

Blockchain Development: Earning ₹6-25 LPA, cryptocurrency market booming

Data Science: ₹6-30 LPA, every company needs data scientists

Cloud Computing: AWS, Azure specialists earning ₹8-35 LPA

Business & Entrepreneurship:
E-commerce: Shopify stores, Amazon FBA - Many earning ₹1-50 lakhs monthly

Digital Marketing: SEO, Social Media Marketing - Agencies earning crores annually

Stock Market Trading: Day trading, swing trading - Successful traders earning lakhs monthly

Cryptocurrency Trading: High risk, high reward - Some earning crores annually

Startup Ecosystem: India has 100+ unicorns, angel investors, VCs active

Dropshipping & Affiliate Marketing: Location independent, earning potential unlimited

Travel & Lifestyle:
Travel Blogging/Vlogging: Successful YouTubers like Varun Vagish earning ₹10+ lakhs monthly

Food Blogging: Instagram food influencers earning ₹2-10 lakhs per month

Fitness Coaching: Online fitness trainers earning ₹5-25 lakhs annually

Life Coaching: Certified coaches charging ₹5,000-25,000 per session

👩 WOMEN EMPOWERMENT & OPPORTUNITIES:
Revolutionary Changes for Indian Women:
Armed Forces: Women now allowed as PILOTS in Air Force (2016), permanent commission in Army (2020), Navy (2021)

Combat Roles: Women can now serve in combat positions - only 5% awareness among girls!

Engineering Colleges: 20% seats reserved for women in top institutions, but many colleges struggle to fill even 10%

STEM Fields: Google, Microsoft, TCS actively hiring women with diversity bonuses

Entrepreneurship: Women-led startups get priority funding, government schemes like Stand-Up India

Defence Services: NDA now open to women (2021), huge opportunity with minimal competition

Unique Women-Focused Opportunities:
Fashion Design & Styling: ₹25,000 crores industry, women dominating

Interior Design: Growing middle-class creating ₹20,000+ crores market

Event Management: Wedding industry worth ₹3 lakh crores

Beauty & Wellness: ₹1.8 lakh crores market, salon ownership highly profitable

Teaching & Child Development: Always in demand, work-life balance

Healthcare: Nursing shortage creating opportunities, ₹6-15 LPA salaries

📊 MARKET SIZE & COMPETITION ANALYSIS:
High Opportunity, Lower Competition:
Ethical Hacking: 3.5 million job shortage globally, minimal competition in India

AI Ethics Specialist: Emerging field, almost zero competition

Sustainability Consultant: Growing 40% annually, very few professionals

Elder Care Services: Aging population, untapped ₹5,000+ crores market

Pet Care Industry: ₹800 crores market, growing 30% annually

Organic Farming: Government support, export opportunities

High Competition, High Rewards:
Software Development: Saturated but huge market ₹19 lakh crores

CA/Finance: Tough competition but guaranteed high earnings

Medical: Extremely competitive but respected, high earning potential

Civil Services: Ultra-competitive but prestigious, secure future

🎯 ENHANCED RESPONSE GUIDELINES:
For General Career Questions:
Be enthusiastic and encouraging about ALL career paths

Use real examples, success stories, and current market data

Ask clarifying questions about interests, skills, background

For female students, actively mention women-specific opportunities and reservations

Provide concrete numbers: salaries, market sizes, growth rates

Give actionable next steps with timelines and resources

Challenge stereotypes and expand career thinking beyond traditional paths

Emphasize skill development over just degree acquisition

For Quiz Results Analysis:
When user shares assessment results:

Immediate Analysis: "Based on your career assessment results, I can see..."

Primary Recommendations: List top 3-5 career paths with reasons

Detailed Roadmap: 6-month, 1-year, 3-year action plans

Skills Development: Specific courses, certifications, projects

Institution Recommendations: Colleges, coaching, online platforms

Networking & Opportunities: Internships, competitions, communities

Financial Planning: Course costs, earning timelines, ROI analysis

For Off-Topic Questions:
Immediately redirect with the standard response and ask for career-related questions.

💡 GUIDANCE PRINCIPLES:
Assess student's interests, strengths, family background, financial situation

Provide realistic earning potential, career growth trajectory, market competition

Suggest skill development roadmap, relevant courses, certifications

Recommend internships, networking opportunities, mentorship programs

Emphasize importance of continuous learning and adaptation

Consider work-life balance, job security, and personal satisfaction

Provide specific next steps: applications, deadlines, preparation strategies

Remember: Every career path has potential if pursued with passion, proper planning, and continuous skill development. Your role is to open minds to possibilities and provide practical roadmaps to success while staying strictly within career guidance scope.

🔧 Implementation Notes:
Scope Control: Always check if question relates to career/education before responding

Quiz Integration: Recognize result-sharing patterns and immediately switch to analysis mode

Comprehensive Coverage: Balance traditional security with modern opportunities

Action-Oriented: Always end with specific next steps and resources

Gender Inclusive: Actively promote women-specific opportunities

Data-Driven: Use concrete numbers and market insights

This enhanced context ensures your AI stays focused on career guidance while providing comprehensive, actionable advice for all students! 🎯 ${message}`
                }]
            });
        } else {
            conversationHistory.push({
                role: 'user',
                parts: [{ text: message }]
            });
        }

        console.log('📤 Sending to Gemini 2.5 Flash...');
        console.log('📚 Conversation history length:', conversationHistory.length);

        // Call Gemini 2.5 Flash with enhanced configuration
        const result = await model.generateContent({
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.8, // Slightly higher for more creative responses
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096, // Optimal for career guidance responses
                candidateCount: 1,
            }
        });

        console.log('📥 Gemini 2.5 Flash response received');

        const response = await result.response;
        const responseText = response.text();
        
        console.log('💬 Response length:', responseText ? responseText.length : 0);
        console.log('🔥 Model: Gemini 2.5 Flash - Latest AI Technology');

        if (!responseText || responseText.trim() === '') {
            throw new Error('Empty response from Gemini 2.5 Flash');
        }

        // Add AI response to conversation history
        conversationHistory.push({
            role: 'model',
            parts: [{ text: responseText }]
        });

        res.json({ 
            response: responseText,
            history: conversationHistory,
            model: 'gemini-2.5-flash',
            version: '2.5'
        });
        
    } catch (error) {
        console.error('❌ Gemini 2.5 Flash Error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details || 'No additional details');
        
        res.status(500).json({ 
            error: 'Failed to get AI response from Gemini 2.5 Flash',
            details: error.message,
            model: 'gemini-2.5-flash'
        });
    }
});

// Enhanced AI Test Endpoint for Gemini 2.5 Flash
app.get('/api/ai-test', async (req, res) => {
    try {
        console.log('🧪 Testing Gemini 2.5 Flash connection...');
        
        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: 'Hello! Please introduce yourself as a career counselor and mention you are powered by Gemini 2.5 Flash.' }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        });
        
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini 2.5 Flash test successful');
        
        res.json({ 
            success: true,
            response: text,
            model: 'gemini-2.5-flash',
            message: "Gemini 2.5 Flash is working correctly",
            features: [
                "Enhanced reasoning capabilities",
                "Improved multimodal understanding", 
                "Better context retention",
                "Advanced thinking processes",
                "Optimized for career guidance"
            ]
        });
        
    } catch (error) {
        console.error('❌ Gemini 2.5 Flash test failed:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            model: 'gemini-2.5-flash'
        });
    }
});

// Optional: Performance Comparison Endpoint
app.get('/api/model-info', (req, res) => {
    res.json({
        currentModel: 'gemini-2.5-flash',
        version: '2.5',
        features: {
            reasoning: 'Advanced thinking capabilities',
            speed: 'Optimized for low latency',
            context: '1 million token context window',
            multimodal: 'Text, image, audio, video support',
            costEfficiency: 'Most cost-effective in 2.5 family',
            thinking: 'Controllable thinking processes'
        },
        improvements: [
            'Better reasoning than Gemini 1.5 Flash',
            'Enhanced career guidance capabilities',
            'Improved context understanding',
            'More accurate and detailed responses',
            'Better handling of complex queries'
        ],
        optimizedFor: [
            'Career counseling',
            'Educational guidance',
            'Real-time conversations',
            'High-volume applications'
        ]
    });
});

// AI Assistant Page Route
app.get('/aiAssistant', (req, res) => {
    res.render('aiAssistant', {
        title: 'AI Career Assistant - CareerGuide',
        description: 'Get personalized career guidance with our AI-powered assistant',
        currentPage: 'aiAssistant',
        cssFile: 'aiAssistant.css',
        jsFile: 'aiAssistant.js'
    });
});

// ✅ FIXED: Manual Career Routes Loading (Before Dynamic Loader)
try {
  console.log('📝 Loading career routes manually...');
  const careerRoutes = require('./routes/career');
  app.use('/career', careerRoutes);
  console.log('✅ Career routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load career routes:', error.message);
}

// ✅ FIXED: Dynamic route loader (REMOVED CAREER FROM HERE)
const routes = [
  { path: '/', file: 'home' },
  // { path: '/career', file: 'career' },  ← REMOVED THIS LINE
  { path: '/colleges', file: 'colleges' },
  { path: '/timeline', file: 'timeline' },
  { path: '/dashboard', file: 'dashboard' },
  { path: '/scholarship', file: 'scholarship' },
  { path: '/quiz', file: 'quiz' }
];

console.log('🔍 Loading remaining routes...');

routes.forEach(route => {
  try {
    console.log(`📝 Loading: ./routes/${route.file}.js`);
    const routeHandler = require(`./routes/${route.file}`);
    
    if (typeof routeHandler === 'function' || routeHandler.router) {
      app.use(route.path, routeHandler);
      console.log(`✅ Route loaded: ${route.path} -> routes/${route.file}.js`);
    } else {
      console.log(`❌ Invalid route handler for: routes/${route.file}.js`);
    }
  } catch (error) {
    console.error(`❌ Failed to load route: routes/${route.file}.js`, error.message);
    
    // Create placeholder route for missing files
    app.use(route.path, (req, res) => {
      res.status(503).render('error', {
        title: `${route.file} - Coming Soon`,
        description: `The ${route.file} feature is under development.`,
        currentPage: route.file,
        message: `The ${route.file} feature is under development.`
      });
    });
  }
});

// Updated Authentication Routes with Database Integration

// Login GET route
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    title: 'Login - CareerGuide',
    description: 'Sign in to your CareerGuide account',
    currentPage: 'login'
  });
});

// Login POST route with Database
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/login');
    }
    
    // Find user in database
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });
    
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }
    
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Create session
    req.session.user = user.getPublicProfile();
    
    req.flash('success_msg', `Welcome back, ${user.profile.fullName}!`);
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'An error occurred during login');
    res.redirect('/login');
  }
});

// Signup GET route
app.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', {
    title: 'Sign Up - CareerGuide',
    description: 'Create your CareerGuide account',
    currentPage: 'signup'
  });
});

// Signup POST route with Database
app.post('/signup', async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      confirmPassword, 
      fullName, 
      dateOfBirth, 
      phoneNumber, 
      currentClass, 
      gender, 
      state, 
      city 
    } = req.body;
    
    // Validation
    if (!username || !email || !password || !confirmPassword || !fullName || 
        !dateOfBirth || !phoneNumber || !currentClass || !gender || !state || !city) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/signup');
    }
    
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/signup');
    }
    
    if (password.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters');
      return res.redirect('/signup');
    }
    
    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      profile: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        currentClass,
        gender,
        state,
        city
      }
    });
    
    await newUser.save();
    
    // Create session
    req.session.user = newUser.getPublicProfile();
    
    req.flash('success_msg', 'Account created successfully! Welcome to CareerGuide.');
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      req.flash('error_msg', `This ${field} is already registered`);
    } else if (error.name === 'ValidationError') {
      // Validation error
      const messages = Object.values(error.errors).map(err => err.message);
      req.flash('error_msg', messages.join('. '));
    } else {
      req.flash('error_msg', 'An error occurred during registration');
    }
    
    res.redirect('/signup');
  }
});

// FIXED LOGOUT ROUTE - This was the problem!
app.get('/logout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  
  const username = req.session.user.profile?.fullName || req.session.user.username || 'User';
  
  // Set flash message BEFORE destroying session
  req.flash('success_msg', `Goodbye, ${username}! You have been logged out successfully.`);
  
  // Save session to persist flash message
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.redirect('/');
    }
    
    // Now destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      
      // Clear the session cookie from client
      res.clearCookie('connect.sid');
      
      // Redirect to home page
      res.redirect('/');
    });
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ai_status: 'Connected',
    database_status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 404 Error handler (must be last)
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;

  if (req.accepts('html')) {
    res.status(status).render('error', {
      title: `Error ${status}`,
      description: message,
      currentPage: 'error',
      error: { status, message, stack: process.env.NODE_ENV === 'development' ? err.stack : null }
    });
  } else if (req.accepts('json')) {
    res.status(status).json({ error: { status, message } });
  } else {
    res.status(status).type('txt').send(`Error ${status}: ${message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CareerGuide Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Model: Gemini 2.5 Flash (Latest & Most Advanced)`);
  console.log(`⚡ Features: Enhanced reasoning, thinking capabilities, multimodal support`);
  console.log(`🗄️  Database: MongoDB Integration with User Authentication`);
  console.log(`🔐 Session Store: MongoDB-backed sessions`);
  console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
});

module.exports = app;
