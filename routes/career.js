const express = require('express');
const router = express.Router();

// Main career page
router.get('/', (req, res) => {
  console.log('🎯 Career main page accessed');
  try {
    res.render('career', {
      title: 'Career Paths - CareerGuide',
      description: 'Explore career options and academic paths with detailed insights',
      currentPage: 'career',
      cssFile: 'career.css',
      jsFile: 'career.js'
    });
  } catch (error) {
    console.error('❌ Career route error:', error);
    res.status(500).render('error', {
      title: '500 - Server Error',
      description: 'An internal server error occurred',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== PCM (Mathematics) Routes - Individual Pages ==========
router.get('/pcm/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 PCM route accessed: ${section}`);
  
  const pcmSections = {
    'engineering': {
      title: 'Engineering Career Guide - CareerGuide',
      description: 'Complete guide to engineering careers, admission, and placements',
      template: 'career/engineering'
    },
    'architecture': {
      title: 'Architecture Career Guide - CareerGuide', 
      description: 'Explore architecture career paths and opportunities',
      template: 'career/architecture'
    },
    'actuarial-science': {
      title: 'Actuarial Science Career Guide - CareerGuide',
      description: 'Risk assessment and financial modeling careers',
      template: 'career/actuarial-science'
    },
    'data-science': {
      title: 'Data Science & AI/ML Career Guide - CareerGuide',
      description: 'AI, ML, and Data Science career opportunities',
      template: 'career/data-science'
    }
  };
  
  const currentSection = pcmSections[section];
  
  if (!currentSection) {
    console.log(`❌ PCM section not found: ${section}`);
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested PCM career section was not found',
      currentPage: 'error',
      error: { status: 404, message: `PCM career section '${section}' not found` }
    });
  }
  
  console.log(`✅ Rendering template: ${currentSection.template}`);
  
  try {
    res.render(currentSection.template, {
      title: currentSection.title,
      description: currentSection.description,
      currentPage: 'career',
      field: section,
      category: 'pcm'
    });
  } catch (error) {
    console.error(`❌ Template render error for ${currentSection.template}:`, error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: `Template '${currentSection.template}' not found or has errors`,
      currentPage: 'error',
      error: error
    });
  }
});

// ========== PCB (Biology) Routes - All go to Biology Page ==========
router.get('/pcb/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 PCB route accessed: ${section}`);
  
  const pcbSections = {
    'mbbs-bds': '#mbbs-bds',
    'nursing-paramedical': '#nursing-paramedical',
    'pharmacy': '#pharmacy',
    'biotechnology': '#biotechnology',
    'agriculture-veterinary': '#agriculture',
    'environmental-food': '#environmental'
  };
  
  if (!pcbSections[section]) {
    console.log(`❌ PCB section not found: ${section}`);
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested PCB career section was not found',
      currentPage: 'error',
      error: { status: 404, message: `PCB career section '${section}' not found` }
    });
  }
  
  console.log(`✅ Rendering biology template with section: ${pcbSections[section]}`);
  
  try {
    res.render('career/biology', {
      title: 'Biology (PCB) Career Guide - CareerGuide',
      description: 'Complete guide to medical sciences and healthcare careers',
      currentPage: 'career',
      field: section,
      category: 'pcb',
      section: pcbSections[section]
    });
  } catch (error) {
    console.error('❌ Biology template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Biology template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== INTERDISCIPLINARY ROUTES ==========
router.get('/interdisciplinary/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Interdisciplinary route accessed: ${section}`);
  
  const interdisciplinarySections = {
    'environmental-science': '#environmental-science',
    'nanotechnology': '#nanotechnology',
    'biomedical-engineering': '#biomedical-engineering'
  };
  
  if (!interdisciplinarySections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Interdisciplinary career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/interdisciplinary', {
      title: 'Interdisciplinary & Emerging Careers - CareerGuide',
      description: 'Cutting-edge interdisciplinary career opportunities',
      currentPage: 'career',
      field: section,
      category: 'interdisciplinary',
      section: interdisciplinarySections[section]
    });
  } catch (error) {
    console.error('❌ Interdisciplinary template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Interdisciplinary template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== COMMERCE/BUSINESS ROUTES ==========
router.get('/commerce/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Commerce route accessed: ${section}`);
  
  const commerceSections = {
    'accounting-finance': '#accounting-finance',
    'business-management': '#business-management',
    'economics-analytics': '#economics-analytics'
  };
  
  if (!commerceSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Commerce career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/commerce', {
      title: 'Commerce & Business Career Guide - CareerGuide',
      description: 'Complete guide to business, finance, and commerce careers',
      currentPage: 'career',
      field: section,
      category: 'commerce',
      section: commerceSections[section]
    });
  } catch (error) {
    console.error('❌ Commerce template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Commerce template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== ARTS & HUMANITIES ROUTES ==========
router.get('/arts/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Arts route accessed: ${section}`);
  
  const artsSections = {
    'social-sciences': '#social-sciences',
    'languages-literature': '#languages-literature',
    'history-philosophy': '#history-philosophy'
  };
  
  if (!artsSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Arts career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/arts', {
      title: 'Arts & Humanities Career Guide - CareerGuide',
      description: 'Complete guide to arts, humanities, and social sciences careers',
      currentPage: 'career',
      field: section,
      category: 'arts',
      section: artsSections[section]
    });
  } catch (error) {
    console.error('❌ Arts template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Arts template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== CREATIVE ARTS ROUTES ==========
router.get('/creative-arts/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Creative Arts route accessed: ${section}`);
  
  const creativeArtsSections = {
    'visual-arts': '#visual-arts',
    'performing-arts': '#performing-arts',
    'fashion-design': '#fashion-design'
  };
  
  if (!creativeArtsSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Creative Arts career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/creative-arts', {
      title: 'Creative & Performing Arts Career Guide - CareerGuide',
      description: 'Complete guide to creative arts and performing arts careers',
      currentPage: 'career',
      field: section,
      category: 'creative-arts',
      section: creativeArtsSections[section]
    });
  } catch (error) {
    console.error('❌ Creative Arts template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Creative Arts template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== VOCATIONAL ROUTES ==========
router.get('/vocational/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Vocational route accessed: ${section}`);
  
  const vocationalSections = {
    'it-computers': '#it-computers',
    'trades-technical': '#trades-technical',
    'hospitality-tourism': '#hospitality-tourism'
  };
  
  if (!vocationalSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Vocational career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/vocational', {
      title: 'Vocational & Skill-Based Career Guide - CareerGuide',
      description: 'Complete guide to vocational and technical skill-based careers',
      currentPage: 'career',
      field: section,
      category: 'vocational',
      section: vocationalSections[section]
    });
  } catch (error) {
    console.error('❌ Vocational template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Vocational template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== HEALTHCARE ROUTES ==========
router.get('/healthcare/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Healthcare route accessed: ${section}`);
  
  const healthcareSections = {
    'nursing': '#nursing',
    'physiotherapy': '#physiotherapy',
    'nutrition-dietetics': '#nutrition-dietetics'
  };
  
  if (!healthcareSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Healthcare career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/healthcare', {
      title: 'Healthcare & Allied Health Career Guide - CareerGuide',
      description: 'Complete guide to healthcare support and allied health careers',
      currentPage: 'career',
      field: section,
      category: 'healthcare',
      section: healthcareSections[section]
    });
  } catch (error) {
    console.error('❌ Healthcare template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Healthcare template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== SPORTS ROUTES ==========
router.get('/sports/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Sports route accessed: ${section}`);
  
  const sportsSections = {
    'professional-sports': '#professional-sports',
    'fitness-health': '#fitness-health'
  };
  
  if (!sportsSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Sports career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/sports', {
      title: 'Sports & Physical Education Career Guide - CareerGuide',
      description: 'Complete guide to professional sports and fitness careers',
      currentPage: 'career',
      field: section,
      category: 'sports',
      section: sportsSections[section]
    });
  } catch (error) {
    console.error('❌ Sports template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Sports template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== LAW ROUTES ==========
router.get('/law/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Law route accessed: ${section}`);
  
  const lawSections = {
    'llb-law': '#llb-law',
    'forensic-science': '#forensic-science'
  };
  
  if (!lawSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Law career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/law', {
      title: 'Law & Legal Studies Career Guide - CareerGuide',
      description: 'Complete guide to legal practice and forensic science careers',
      currentPage: 'career',
      field: section,
      category: 'law',
      section: lawSections[section]
    });
  } catch (error) {
    console.error('❌ Law template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Law template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== GOVERNMENT ROUTES ==========
router.get('/government/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Government route accessed: ${section}`);
  
  const governmentSections = {
    'upsc-civil-services': '#upsc-civil-services'
  };
  
  if (!governmentSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Government career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/government', {
      title: 'Government & Civil Services Career Guide - CareerGuide',
      description: 'Complete guide to UPSC, state services, and public administration careers',
      currentPage: 'career',
      field: section,
      category: 'government',
      section: governmentSections[section]
    });
  } catch (error) {
    console.error('❌ Government template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Government template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// ========== ENTREPRENEURSHIP ROUTES ==========
router.get('/entrepreneurship/:section', (req, res) => {
  const section = req.params.section;
  console.log(`🔍 Entrepreneurship route accessed: ${section}`);
  
  const entrepreneurshipSections = {
    'business-startups': '#business-startups'
  };
  
  if (!entrepreneurshipSections[section]) {
    return res.status(404).render('error', {
      title: '404 - Page Not Found',
      description: 'The requested Entrepreneurship career section was not found',
      currentPage: 'error'
    });
  }
  
  try {
    res.render('career/entrepreneurship', {
      title: 'Entrepreneurship & Startups Career Guide - CareerGuide',
      description: 'Complete guide to business creation and startup ecosystem opportunities',
      currentPage: 'career',
      field: section,
      category: 'entrepreneurship',
      section: entrepreneurshipSections[section]
    });
  } catch (error) {
    console.error('❌ Entrepreneurship template render error:', error);
    res.status(500).render('error', {
      title: '500 - Template Error',
      description: 'Entrepreneurship template not found or has errors',
      currentPage: 'error',
      error: error
    });
  }
});

// Test route to verify routing works
router.get('/test', (req, res) => {
  console.log('🧪 Test route accessed');
  res.send(`
    <h1>Career Routes Test</h1>
    <h2>All Career Categories Working:</h2>
    <ul>
      <li><a href="/career">/career - Main career page</a></li>
      <li><a href="/career/pcm/engineering">/career/pcm/engineering - Engineering</a></li>
      <li><a href="/career/pcb/mbbs-bds">/career/pcb/mbbs-bds - MBBS/BDS</a></li>
      <li><a href="/career/commerce/accounting-finance">/career/commerce/accounting-finance - Commerce</a></li>
      <li><a href="/career/arts/social-sciences">/career/arts/social-sciences - Arts</a></li>
      <li><a href="/career/creative-arts/visual-arts">/career/creative-arts/visual-arts - Creative Arts</a></li>
      <li><a href="/career/vocational/it-computers">/career/vocational/it-computers - Vocational</a></li>
      <li><a href="/career/healthcare/nursing">/career/healthcare/nursing - Healthcare</a></li>
      <li><a href="/career/sports/professional-sports">/career/sports/professional-sports - Sports</a></li>
      <li><a href="/career/law/llb-law">/career/law/llb-law - Law</a></li>
      <li><a href="/career/government/upsc-civil-services">/career/government/upsc-civil-services - Government</a></li>
      <li><a href="/career/entrepreneurship/business-startups">/career/entrepreneurship/business-startups - Entrepreneurship</a></li>
    </ul>
  `);
});

module.exports = router;
