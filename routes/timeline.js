const express = require('express');
const router = express.Router();

// Timeline page route
router.get('/', (req, res) => {
    res.render('timeline', {
        title: 'Career Timeline 2025 - CareerGuide',
        description: 'Never miss important deadlines with our comprehensive career timeline',
        currentPage: 'timeline',
        cssFile: 'timeline.css',
        jsFile: 'timeline.js'
    });
});

// API endpoint for timeline data
router.get('/api/events', (req, res) => {
    // In production, this would fetch from database
    const timelineEvents = {
        "2025-09": [
            {
                id: "ignou-admission",
                title: "IGNOU Last Date for Admission",
                date: "2025-09-15",
                category: "admissions",
                priority: "urgent",
                description: "Final deadline for IGNOU distance education programs.",
                link: "https://www.ignou.ac.in/?prvcaeprm=1741342725520",
                videoId: "ignou-guide"
            },
            {
                id: "nsp-deadline",
                title: "National Scholarship Portal - Student Deadline",
                date: "2025-09-15",
                category: "scholarships",
                priority: "critical",
                description: "Last date for central government scholarships.",
                amount: "₹75,000+ annually",
                link: "https://scholarships.gov.in"
            },
            {
                id: "ssc-cgl",
                title: "SSC CGL Tier-I Examination",
                date: "2025-09-12",
                category: "government",
                priority: "ongoing",
                description: "Combined Graduate Level examination for Central Government posts.",
                salary: "₹25,500 - ₹81,100 per month",
                link: "https://ssc.nic.in"
            },
            {
                id: "women-pilots",
                title: "Indian Air Force - Women Pilot Recruitment",
                date: "2025-09-20",
                category: "women",
                priority: "special",
                description: "Historic opportunity! Women can now apply as fighter pilots.",
                link: "https://indianairforce.nic.in"
            }
        ],
        "2025-10": [
            {
                id: "ssc-je",
                title: "SSC JE Paper-I (Junior Engineer)",
                date: "2025-10-27",
                category: "professional",
                priority: "important",
                description: "Junior Engineer recruitment for technical posts.",
                salary: "₹35,400 - ₹1,12,400",
                link: "https://ssc.nic.in"
            }
        ],
        "2025-11": [
            {
                id: "cat-2025",
                title: "CAT 2025 - MBA Entrance Exam",
                date: "2025-11-30",
                category: "exams",
                priority: "critical",
                description: "Common Admission Test for IIMs and top B-schools.",
                stats: {
                    iims: "20+",
                    package: "₹25 LPA+"
                },
                link: "https://iimcat.ac.in"
            }
        ]
    };
    
    res.json(timelineEvents);
});

// API endpoint for setting reminders
router.post('/api/reminders', (req, res) => {
    const { eventId, userId, notificationTypes, timing } = req.body;
    
    // In production, save to database
    console.log('Setting reminder:', { eventId, userId, notificationTypes, timing });
    
    res.json({ 
        success: true, 
        message: 'Reminder set successfully',
        reminderId: `reminder_${Date.now()}`
    });
});

// API endpoint for event details
router.get('/api/events/:eventId', (req, res) => {
    const { eventId } = req.params;
    
    // Mock event details - in production, fetch from database
    const eventDetails = {
        'ignou-admission': {
            title: 'IGNOU Admission Details',
            fullDescription: 'Indira Gandhi National Open University offers distance education programs.',
            courses: ['BBA', 'B.Com', 'BA', 'B.Sc', 'MBA', 'MCA', 'MA', 'M.Sc'],
            fees: '₹200 - ₹500 depending on course',
            documents: ['10th & 12th Mark Sheets', 'Graduation Certificate (for PG)', 'Identity Proof', 'Recent Photographs'],
            features: ['Distance Learning', 'Affordable Fees', 'Flexible Schedule', 'UGC Recognized']
        },
        'nsp-deadline': {
            title: 'National Scholarship Portal Details',
            fullDescription: 'Central government scholarship platform for various student categories.',
            scholarships: ['Merit-cum-Means', 'Minority Scholarships', 'SC/ST/OBC Scholarships'],
            amount: '₹10,000 to ₹75,000 per year',
            eligibility: 'Based on family income, academic performance, and category',
            documents: ['Income Certificate', 'Caste Certificate', 'Mark Sheets', 'Bank Details']
        }
    };
    
    const details = eventDetails[eventId];
    if (details) {
        res.json(details);
    } else {
        res.status(404).json({ error: 'Event details not found' });
    }
});

module.exports = router;
