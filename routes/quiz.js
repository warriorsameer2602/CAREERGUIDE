const express = require('express');
const router = express.Router();

// Store results in memory (use database in production)
let quizResults = null;

// ALL 60 QUESTIONS - COMPLETE SET
const quizQuestions = [
    { id: 1, section: 'numerical-reasoning', question: "Find the next number in the series: 3, 9, 27, 81, ?", options: ["162", "243", "324", "405"], correct: 1, type: 'aptitude' },
    { id: 2, section: 'numerical-reasoning', question: "A class has 40 students. 60% are boys. How many girls?", options: ["14", "16", "18", "20"], correct: 1, type: 'aptitude' },
    { id: 3, section: 'numerical-reasoning', question: "If a book costs ₹240 after 20% discount, what was the original price?", options: ["₹288", "₹300", "₹320", "₹360"], correct: 1, type: 'aptitude' },
    { id: 4, section: 'numerical-reasoning', question: "In a mixture of 60L, milk and water are in the ratio 7:3. How much milk?", options: ["36L", "42L", "45L", "48L"], correct: 1, type: 'aptitude' },
    { id: 5, section: 'numerical-reasoning', question: "What is the simple interest on ₹5000 at 8% per annum for 2 years?", options: ["₹600", "₹700", "₹800", "₹900"], correct: 2, type: 'aptitude' },
    { id: 6, section: 'numerical-reasoning', question: "6 people complete work in 10 days. How many days will 4 people take?", options: ["12", "15", "18", "20"], correct: 1, type: 'aptitude' },
    { id: 7, section: 'numerical-reasoning', question: "If today is Wednesday, what day will it be after 100 days?", options: ["Monday", "Tuesday", "Thursday", "Friday"], correct: 0, type: 'aptitude' },
    { id: 8, section: 'verbal-reasoning', question: "Book : Library :: Patient : ?", options: ["Doctor", "Hospital", "Medicine", "Nurse"], correct: 1, type: 'aptitude' },
    { id: 9, section: 'verbal-reasoning', question: "Choose the opposite of 'Abundant':", options: ["Plenty", "Scarce", "Sufficient", "Rich"], correct: 1, type: 'aptitude' },
    { id: 10, section: 'verbal-reasoning', question: "What is the main message about environmental conservation?", options: ["Pollution is increasing", "Trees are important", "We must act now", "Government should help"], correct: 2, type: 'aptitude' },
    { id: 11, section: 'verbal-reasoning', question: "Arrange in logical order: 1) He became successful 2) He worked hard 3) He got a job 4) He studied well", options: ["4,2,3,1", "2,4,3,1", "4,3,2,1", "3,4,2,1"], correct: 0, type: 'aptitude' },
    { id: 12, section: 'verbal-reasoning', question: "'Meticulous' means:", options: ["Careless", "Very careful", "Fast", "Simple"], correct: 1, type: 'aptitude' },
    { id: 13, section: 'verbal-reasoning', question: "Find the error: 'Each of the students have completed their homework.'", options: ["Each of", "students have", "completed their", "No error"], correct: 1, type: 'aptitude' },
    { id: 14, section: 'verbal-reasoning', question: "Choose word similar to 'Innovation':", options: ["Tradition", "Creation", "Destruction", "Imitation"], correct: 1, type: 'aptitude' },
    { id: 15, section: 'logical-spatial', question: "Complete the series: A, D, G, J, ?", options: ["K", "L", "M", "N"], correct: 2, type: 'aptitude' },
    { id: 16, section: 'logical-spatial', question: "If you rotate a shape 90° clockwise, which option matches?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 1, type: 'aptitude' },
    { id: 17, section: 'logical-spatial', question: "All roses are flowers. Some flowers are red. Therefore:", options: ["All roses are red", "Some roses may be red", "No roses are red", "Cannot determine"], correct: 1, type: 'aptitude' },
    { id: 18, section: 'logical-spatial', question: "If CAT = 3120, what is DOG?", options: ["4157", "4167", "4175", "4165"], correct: 1, type: 'aptitude' },
    { id: 19, section: 'logical-spatial', question: "Raj walks 5km North, then 3km East, then 5km South. How far from start?", options: ["3km", "5km", "8km", "13km"], correct: 0, type: 'aptitude' },
    { id: 20, section: 'logical-spatial', question: "What comes next in the visual pattern?", options: ["Triangle", "Circle", "Square", "Pentagon"], correct: 2, type: 'aptitude' },
    
    // Activity Preferences (21-30)
    // { id: 21, section: 'activity-preferences', question: "Rate: Solving mathematical puzzles and problems", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'science' },
    // { id: 22, section: 'activity-preferences', question: "Rate: Reading books and writing stories", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'humanities' },
    // { id: 23, section: 'activity-preferences', question: "Rate: Conducting simple science experiments", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'science' },
    // { id: 24, section: 'activity-preferences', question: "Rate: Drawing, painting, or designing", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'humanities' },
    // { id: 25, section: 'activity-preferences', question: "Rate: Helping friends with their problems", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'humanities' },
    // { id: 26, section: 'activity-preferences', question: "Rate: Leading group activities or projects", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'commerce' },
    // { id: 27, section: 'activity-preferences', question: "Rate: Using computers and mobile apps", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'science' },
    // { id: 28, section: 'activity-preferences', question: "Rate: Taking things apart to see how they work", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'science' },
    // { id: 29, section: 'activity-preferences', question: "Rate: Debating and expressing opinions", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'humanities' },
    // { id: 30, section: 'activity-preferences', question: "Rate: Teaching or explaining things to others", options: ["1 - Strongly Dislike", "2 - Dislike", "3 - Neutral", "4 - Like", "5 - Strongly Like"], type: 'interest', stream: 'humanities' },
    
    // Subject & Learning Style (31-40)
    // { id: 31, section: 'subject-learning', question: "Which subject excites you most?", options: ["Mathematics", "Science", "English", "Social Studies"], type: 'interest', streams: ['science', 'science', 'humanities', 'humanities'] },
    // { id: 32, section: 'subject-learning', question: "In which subject do you score best with least effort?", options: ["Math & Science", "Languages", "Social Studies", "Creative subjects"], type: 'interest', streams: ['science', 'humanities', 'humanities', 'humanities'] },
    // { id: 33, section: 'subject-learning', question: "Which type of questions do you enjoy solving?", options: ["Numerical problems", "Language puzzles", "Logic questions", "Creative tasks"], type: 'interest', streams: ['science', 'humanities', 'science', 'humanities'] },
    // { id: 34, section: 'subject-learning', question: "Your ideal project would involve:", options: ["Calculations & analysis", "Research & writing", "Building something", "Artistic creation"], type: 'interest', streams: ['science', 'humanities', 'science', 'humanities'] },
    // { id: 35, section: 'subject-learning', question: "You find it easy to understand:", options: ["How machines work", "Why events happen", "Human behavior", "Creative expressions"], type: 'interest', streams: ['science', 'humanities', 'humanities', 'humanities'] },
    // { id: 36, section: 'subject-learning', question: "You learn best when:", options: ["Working with numbers", "Reading texts", "Doing hands-on activities", "Discussing ideas"], type: 'interest', streams: ['science', 'humanities', 'science', 'humanities'] },
    // { id: 37, section: 'subject-learning', question: "Your ideal study environment:", options: ["Quiet library", "Group study", "With music", "Interactive sessions"], type: 'personality', streams: ['science', 'commerce', 'humanities', 'humanities'] },
    // { id: 38, section: 'subject-learning', question: "You prefer assignments that are:", options: ["Step-by-step logical", "Open-ended creative", "Research-based", "Practical application"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'science'] },
    // { id: 39, section: 'subject-learning', question: "When explaining something to friends, you:", options: ["Use examples & logic", "Tell stories", "Draw diagrams", "Give practical tips"], type: 'personality', streams: ['science', 'humanities', 'science', 'commerce'] },
    // { id: 40, section: 'subject-learning', question: "You're motivated by:", options: ["Solving challenges", "Helping others", "Creating beauty", "Achieving goals"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    
    // Career Interest Areas (41-45)
    // { id: 41, section: 'career-interests', question: "Which work environment appeals to you?", options: ["Laboratory", "Office", "Hospital", "Studio"], type: 'career', streams: ['science', 'commerce', 'science', 'humanities'] },
    // { id: 42, section: 'career-interests', question: "You'd be excited to:", options: ["Discover something new", "Design something beautiful", "Help solve people's problems", "Lead a successful project"], type: 'career', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 43, section: 'career-interests', question: "Your ideal daily work involves:", options: ["Analyzing data", "Meeting people", "Creating content", "Managing operations"], type: 'career', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 44, section: 'career-interests', question: "You're naturally good at:", options: ["Spotting patterns", "Understanding emotions", "Generating ideas", "Organizing systems"], type: 'career', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 45, section: 'career-interests', question: "Which achievement would make you proudest?", options: ["Winning science competition", "Publishing a story", "Helping someone succeed", "Starting a business"], type: 'career', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    
    // Behavioral & Decision Making (46-55)
    // { id: 46, section: 'behavioral', question: "You prefer to work:", options: ["Alone focusing deeply", "In small groups", "With many people", "Sometimes alone, sometimes with others"], type: 'personality', streams: ['science', 'commerce', 'humanities', 'commerce'] },
    // { id: 47, section: 'behavioral', question: "When facing a difficult problem:", options: ["Research systematically", "Try different approaches", "Ask for help", "Break into smaller parts"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'science'] },
    // { id: 48, section: 'behavioral', question: "You handle pressure by:", options: ["Planning carefully", "Staying calm", "Seeking support", "Working harder"], type: 'personality', streams: ['science', 'science', 'humanities', 'commerce'] },
    // { id: 49, section: 'behavioral', question: "In group projects, you usually:", options: ["Do the technical work", "Present to the class", "Coordinate everyone", "Come up with ideas"], type: 'personality', streams: ['science', 'humanities', 'commerce', 'humanities'] },
    // { id: 50, section: 'behavioral', question: "Your friends say you're:", options: ["Very logical", "Very creative", "Very helpful", "Very organized"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 51, section: 'behavioral', question: "When choosing between options, you:", options: ["Compare pros and cons", "Go with gut feeling", "Ask others' opinions", "Research thoroughly"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'science'] },
    // { id: 52, section: 'behavioral', question: "Your biggest strength is:", options: ["Problem-solving", "Communication", "Creativity", "Leadership"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 53, section: 'behavioral', question: "You're happiest when:", options: ["Mastering difficult concepts", "Expressing yourself", "Making others happy", "Achieving targets"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 54, section: 'behavioral', question: "Which describes your ideal future?", options: ["Becoming an expert", "Being creative", "Helping society", "Being successful"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    // { id: 55, section: 'behavioral', question: "You're motivated by:", options: ["Intellectual challenges", "Artistic expression", "Social recognition", "Financial success"], type: 'personality', streams: ['science', 'humanities', 'humanities', 'commerce'] },
    
    // Stream-Specific Indicators (56-60)
    { id: 56, section: 'stream-indicators', question: "Which combination interests you most?", options: ["Math + Physics + Chemistry", "Physics + Chemistry + Biology", "History + Political Science + Economics", "Accounts + Business + Economics"], type: 'stream', streams: ['science', 'science', 'humanities', 'commerce'] },
    { id: 57, section: 'stream-indicators', question: "You enjoy activities that involve:", options: ["Calculations and formulas", "Experiments and observations", "Reading and analysis", "Planning and organizing"], type: 'stream', streams: ['science', 'science', 'humanities', 'commerce'] },
    { id: 58, section: 'stream-indicators', question: "Your natural curiosity is about:", options: ["How things work mechanically", "How living things function", "How society operates", "How business succeeds"], type: 'stream', streams: ['science', 'science', 'humanities', 'commerce'] },
    { id: 59, section: 'stream-indicators', question: "You find satisfaction in:", options: ["Solving complex equations", "Understanding life processes", "Analyzing human behavior", "Managing resources"], type: 'stream', streams: ['science', 'science', 'humanities', 'commerce'] },
    { id: 60, section: 'stream-indicators', question: "Which statement best describes you?", options: ["I love logical thinking and precision", "I'm fascinated by life and nature", "I enjoy understanding people and society", "I'm interested in business and commerce"], type: 'stream', streams: ['science', 'science', 'humanities', 'commerce'] }
];

// Quiz Page
router.get('/', (req, res) => {
    res.render('quiz', {
        title: 'Career Assessment Quiz - CareerGuide',
        description: 'Complete career assessment quiz',
        currentPage: 'quiz',
        cssFile: 'quiz.css',
        jsFile: 'quiz.js'
    });
});

// API: Get Questions
router.get('/api/questions', (req, res) => {
    res.json({
        success: true,
        questions: quizQuestions,
        count: quizQuestions.length
    });
});

// ADVANCED CAREER RECOMMENDATION ALGORITHM
function calculateCareerRecommendation(answers, timeSpent, totalQuestions) {
    console.log('🧮 Starting advanced career calculation...');
    
    // Initialize detailed score tracking
    let aptitudeScores = { numerical: 0, verbal: 0, logical: 0 };
    let interestScores = { science: 0, commerce: 0, humanities: 0 };
    let personalityScores = { science: 0, commerce: 0, humanities: 0 };
    let streamScores = { science: 0, commerce: 0, humanities: 0 };
    
    // Detailed counters for accurate percentage calculation
    let aptitudeCounts = { numerical: 0, verbal: 0, logical: 0 };
    let interestCounts = { science: 0, commerce: 0, humanities: 0 };
    let personalityCounts = { science: 0, commerce: 0, humanities: 0 };
    let streamCounts = { science: 0, commerce: 0, humanities: 0 };
    
    // Process each answer with your sophisticated logic
    Object.keys(answers).forEach(questionId => {
        const question = quizQuestions.find(q => q.id == questionId);
        const answerIndex = answers[questionId];
        
        if (!question || answerIndex === undefined) return;
        
        console.log(`Processing Q${questionId}: ${question.section}, Answer: ${answerIndex}`);
        
        // 1. APTITUDE SCORING (Questions 1-20)
        if (question.type === 'aptitude') {
            const isCorrect = answerIndex === question.correct ? 1 : 0;
            const points = isCorrect * 5; // 5 points for correct answer
            
            if (question.section === 'numerical-reasoning') {
                aptitudeScores.numerical += points;
                aptitudeCounts.numerical++;
            } else if (question.section === 'verbal-reasoning') {
                aptitudeScores.verbal += points;
                aptitudeCounts.verbal++;
            } else if (question.section === 'logical-spatial') {
                aptitudeScores.logical += points;
                aptitudeCounts.logical++;
            }
        }
        
        // 2. INTEREST SCORING (Questions 21-45)
        if (question.type === 'interest' || question.type === 'career') {
            const likertPoints = answerIndex + 1; // 1-5 scale
            
            if (question.stream) {
                // Single stream mapping
                if (question.stream === 'science') {
                    interestScores.science += likertPoints;
                    interestCounts.science++;
                } else if (question.stream === 'commerce') {
                    interestScores.commerce += likertPoints;
                    interestCounts.commerce++;
                } else if (question.stream === 'humanities') {
                    interestScores.humanities += likertPoints;
                    interestCounts.humanities++;
                }
            } else if (question.streams) {
                // Multiple streams - award points to selected stream
                const selectedStream = question.streams[answerIndex];
                if (selectedStream === 'science') {
                    interestScores.science += 5;
                    interestCounts.science++;
                } else if (selectedStream === 'commerce') {
                    interestScores.commerce += 5;
                    interestCounts.commerce++;
                } else if (selectedStream === 'humanities') {
                    interestScores.humanities += 5;
                    interestCounts.humanities++;
                }
            }
        }
        
        // 3. PERSONALITY SCORING (Questions 46-55)
        if (question.type === 'personality') {
            const personalityPoints = answerIndex + 1;
            
            if (question.streams) {
                const selectedStream = question.streams[answerIndex];
                if (selectedStream === 'science') {
                    personalityScores.science += personalityPoints;
                    personalityCounts.science++;
                } else if (selectedStream === 'commerce') {
                    personalityScores.commerce += personalityPoints;  
                    personalityCounts.commerce++;
                } else if (selectedStream === 'humanities') {
                    personalityScores.humanities += personalityPoints;
                    personalityCounts.humanities++;
                }
            }
        }
        
        // 4. STREAM INDICATOR SCORING (Questions 56-60)
        if (question.type === 'stream') {
            if (question.streams) {
                const selectedStream = question.streams[answerIndex];
                if (selectedStream === 'science') {
                    streamScores.science += 10; // Higher weight for direct stream questions
                    streamCounts.science++;
                } else if (selectedStream === 'commerce') {
                    streamScores.commerce += 10;
                    streamCounts.commerce++;
                } else if (selectedStream === 'humanities') {
                    streamScores.humanities += 10;
                    streamCounts.humanities++;
                }
            }
        }
    });
    
    // Convert raw scores to percentages
    const aptitudePercentages = {
        numerical: aptitudeCounts.numerical > 0 ? Math.round((aptitudeScores.numerical / (aptitudeCounts.numerical * 5)) * 100) : 0,
        verbal: aptitudeCounts.verbal > 0 ? Math.round((aptitudeScores.verbal / (aptitudeCounts.verbal * 5)) * 100) : 0,
        logical: aptitudeCounts.logical > 0 ? Math.round((aptitudeScores.logical / (aptitudeCounts.logical * 5)) * 100) : 0
    };
    
    // Normalize interest scores (0-100 scale)
    const maxInterest = Math.max(interestScores.science, interestScores.commerce, interestScores.humanities) || 1;
    const interestPercentages = {
        science: Math.round((interestScores.science / maxInterest) * 100),
        commerce: Math.round((interestScores.commerce / maxInterest) * 100),
        humanities: Math.round((interestScores.humanities / maxInterest) * 100)
    };
    
    // Normalize personality scores
    const maxPersonality = Math.max(personalityScores.science, personalityScores.commerce, personalityScores.humanities) || 1;
    const personalityPercentages = {
        science: Math.round((personalityScores.science / maxPersonality) * 100),
        commerce: Math.round((personalityScores.commerce / maxPersonality) * 100),
        humanities: Math.round((personalityScores.humanities / maxPersonality) * 100)
    };
    
    // YOUR EXACT WEIGHTED COMPOSITE FORMULA
    const compositeScores = {
        science: Math.round(
            (aptitudePercentages.numerical * 0.35) +  // 35% weight for numerical aptitude
            (aptitudePercentages.logical * 0.25) +    // 25% weight for logical aptitude
            (interestPercentages.science * 0.25) +    // 25% weight for science interest
            (personalityPercentages.science * 0.15)   // 15% weight for science personality
        ),
        commerce: Math.round(
            (aptitudePercentages.numerical * 0.25) +  // 25% weight for numerical aptitude
            (aptitudePercentages.verbal * 0.20) +     // 20% weight for verbal aptitude
            (aptitudePercentages.logical * 0.15) +    // 15% weight for logical aptitude
            (interestPercentages.commerce * 0.25) +   // 25% weight for commerce interest
            (personalityPercentages.commerce * 0.15)  // 15% weight for commerce personality
        ),
        humanities: Math.round(
            (aptitudePercentages.verbal * 0.40) +     // 40% weight for verbal aptitude
            (aptitudePercentages.logical * 0.20) +    // 20% weight for logical aptitude
            (interestPercentages.humanities * 0.25) + // 25% weight for humanities interest
            (personalityPercentages.humanities * 0.15) // 15% weight for humanities personality
        )
    };
    
    // Determine primary recommendation
    const maxScore = Math.max(compositeScores.science, compositeScores.commerce, compositeScores.humanities);
    let primaryRecommendation = 'Science Stream (PCM)';
    
    if (maxScore === compositeScores.commerce) {
        primaryRecommendation = 'Commerce Stream';
    } else if (maxScore === compositeScores.humanities) {
        primaryRecommendation = 'Humanities Stream';
    }
    
    // Calculate confidence level
    const sortedScores = Object.values(compositeScores).sort((a, b) => b - a);
    const gap = sortedScores[0] - sortedScores[1];
    const confidence = gap >= 15 ? 'High' : gap >= 8 ? 'Moderate' : 'Low';
    
    // Generate career options based on recommendation
    const careerOptions = getDetailedCareerOptions(primaryRecommendation, compositeScores);
    
    // Generate comprehensive analysis
    const detailAnalysis = generateComprehensiveAnalysis(
        compositeScores, 
        aptitudePercentages, 
        interestPercentages, 
        personalityPercentages,
        primaryRecommendation
    );
    
    console.log('✅ Advanced calculation complete:', {
        compositeScores,
        aptitudePercentages,
        primaryRecommendation,
        confidence
    });
    
    return {
        primaryRecommendation,
        confidence,
        scores: compositeScores,  
        aptitudeScores: aptitudePercentages,
        interestScores: interestPercentages,
        personalityScores: personalityPercentages,
        compositeScores: compositeScores,
        careerOptions: careerOptions,
        totalQuestions: totalQuestions || 60,
        answeredQuestions: Object.keys(answers).length,
        timeSpent: timeSpent || 0,
        detailAnalysis: detailAnalysis,
        // Additional detailed breakdown
        rawScores: {
            aptitude: aptitudeScores,
            interest: interestScores,
            personality: personalityScores,
            stream: streamScores
        },
        scoringBreakdown: {
            aptitudeCounts,
            interestCounts,
            personalityCounts,
            streamCounts
        }
    };
}

// Enhanced career options generator
function getDetailedCareerOptions(stream, scores) {
    const careerMap = {
        'Science Stream (PCM)': [
            'Computer Science Engineering',
            'Mechanical Engineering', 
            'Electronics Engineering',
            'Data Science & Analytics',
            'Aerospace Engineering',
            'Biotechnology',
            'Research Scientist',
            'Software Development',
            'Artificial Intelligence',
            'Robotics Engineering'
        ],
        'Commerce Stream': [
            'Chartered Accountancy (CA)',
            'Company Secretary (CS)',
            'Cost & Management Accounting (CMA)', 
            'Bachelor of Business Administration (BBA)',
            'Economics Honours',
            'Banking & Finance',
            'Digital Marketing',
            'Entrepreneurship',
            'Investment Banking',
            'Financial Planning'
        ],
        'Humanities Stream': [
            'Psychology',
            'Sociology',
            'Literature & Creative Writing',
            'Journalism & Mass Communication',
            'Law (LLB)',
            'Social Work',
            'Political Science',
            'History & Archaeology',
            'Philosophy',
            'Teaching & Education'
        ]
    };
    
    return careerMap[stream] || ['General Career Guidance', 'Skill Development Programs'];
}

// Comprehensive analysis generator
// FIXED: Comprehensive analysis generator with proper strengths logic
function generateComprehensiveAnalysis(compositeScores, aptitudeScores, interestScores, personalityScores, recommendation) {
    const strengths = [];
    const recommendations = [];
    const nextSteps = [];
    
    // FIXED: Analyze aptitude strengths with proper logic
    if (aptitudeScores.numerical >= 80) {
        strengths.push('Exceptional mathematical and quantitative abilities');
    } else if (aptitudeScores.numerical >= 65) {
        strengths.push('Strong numerical reasoning skills');
    } else if (aptitudeScores.numerical >= 50) {
        strengths.push('Good basic mathematical skills');
    }
    
    if (aptitudeScores.verbal >= 80) {
        strengths.push('Outstanding verbal and language comprehension');
    } else if (aptitudeScores.verbal >= 65) {
        strengths.push('Strong communication and language skills');
    } else if (aptitudeScores.verbal >= 50) {
        strengths.push('Good verbal reasoning abilities');
    }
    
    if (aptitudeScores.logical >= 80) {
        strengths.push('Superior logical reasoning and problem-solving abilities');
    } else if (aptitudeScores.logical >= 65) {
        strengths.push('Strong analytical and logical thinking skills');
    } else if (aptitudeScores.logical >= 50) {
        strengths.push('Good logical reasoning capabilities');
    }
    
    // FIXED: Add interest-based strengths
    const maxInterest = Math.max(interestScores.science, interestScores.commerce, interestScores.humanities);
    if (interestScores.science === maxInterest && interestScores.science >= 70) {
        strengths.push('Strong interest in science and technology fields');
    }
    if (interestScores.commerce === maxInterest && interestScores.commerce >= 70) {
        strengths.push('Natural inclination towards business and commerce');
    }
    if (interestScores.humanities === maxInterest && interestScores.humanities >= 70) {
        strengths.push('Excellent aptitude for humanities and social sciences');
    }
    
    // FIXED: Ensure at least some strengths are always shown
    if (strengths.length === 0) {
        strengths.push('Well-rounded academic abilities across multiple subjects');
        strengths.push('Balanced approach to problem-solving');
        strengths.push('Good potential for diverse career paths');
    }
    
    // Generate specific recommendations
    if (recommendation.includes('Science')) {
        recommendations.push('Pursue Science stream with Physics, Chemistry, Mathematics');
        recommendations.push('Consider engineering entrance exam preparation');
        recommendations.push('Explore research opportunities in STEM fields');
        
        nextSteps.push('Start preparing for JEE Main/Advanced for engineering');
        nextSteps.push('Strengthen foundation in PCM subjects');
        nextSteps.push('Learn programming languages like Python, Java');
        nextSteps.push('Explore internships in technology companies');
        nextSteps.push('Consider Olympiad participation in Mathematics/Science');
    } else if (recommendation.includes('Commerce')) {
        recommendations.push('Choose Commerce stream with Accountancy, Business Studies, Economics');
        recommendations.push('Consider professional courses like CA, CS, CMA');
        recommendations.push('Develop business acumen and financial literacy');
        
        nextSteps.push('Prepare for commerce entrance exams like DU JAT, NPAT');
        nextSteps.push('Start learning basic accounting principles');
        nextSteps.push('Develop analytical skills for business case studies');
        nextSteps.push('Explore internships in banks or financial institutions');
        nextSteps.push('Consider entrepreneurship workshops');
    } else {
        recommendations.push('Pursue Humanities with subjects matching your interest');
        recommendations.push('Develop strong research and analytical skills');
        recommendations.push('Consider creative and communication-focused careers');
        
        nextSteps.push('Improve essay writing and communication skills');
        nextSteps.push('Participate in debates, MUNs, and literary activities');
        nextSteps.push('Explore internships in media, NGOs, or educational institutions');
        nextSteps.push('Consider studying additional languages');
        nextSteps.push('Develop portfolio for creative fields');
    }
    
    return { strengths, recommendations, nextSteps };
}


// UPDATED Submit Quiz - Using Advanced Algorithm
router.post('/submit', (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        
        console.log('📤 Quiz submitted with', Object.keys(answers).length, 'answers');
        
        // Use ADVANCED ALGORITHM instead of mock calculation
        quizResults = calculateCareerRecommendation(answers, timeSpent, 60);
        
        console.log('✅ Advanced results calculated:', quizResults.primaryRecommendation);
        
        // Return success response
        res.json({ success: true, message: 'Quiz submitted successfully' });
        
    } catch (error) {
        console.error('❌ Submit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Results Page
router.get('/results', (req, res) => {
    if (!quizResults) {
        return res.redirect('/quiz');
    }
    
    res.render('quiz-result', {
        title: 'Career Assessment Results - CareerGuide',
        description: 'Your career assessment results',
        currentPage: 'quiz',
        cssFile: 'quiz.css',
        jsFile: 'quiz.js',
        results: quizResults
    });
});

module.exports = router;
