/* ==========================================================================
   ARRISE DIGITAL — CLIENT PROJECT DATA
   Centralized, per-client project information and media.
   Each client owns its own media. Nothing is shared globally.
   Page-scoped paths are relative (../) so this file works from /clients/*.
   ========================================================================== */
window.ARRISE_CLIENTS = {

  'abs-utility-solutions': {
    id: 'abs-utility-solutions',
    name: 'ABS Utilities',
    pageName: 'ABS Utility Solutions',
    handle: '@abs.utilities',
    category: 'SOCIAL MEDIA MARKETING',
    description: 'Utility solutions — B2B content and lead-generation creative.',
    overview: 'Comprehensive B2B digital marketing solution including lead generation, content strategy, and marketing automation that delivered qualified business inquiries.',
    services: ['B2B Marketing', 'Lead Generation', 'Content Strategy', 'Social Media Marketing'],
    stats: [
      { target: 110, suffix: 'K+', label: 'Views' },
      { target: 20, suffix: 'K+', label: 'Followers' },
      { target: 2.8, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/abs-utility-solutions.svg',
    cover: '../images/clients/abs-utility-solutions.svg',
    reels: [
      { id: 'abs-01', title: 'Reel 01', video: '../videos/abs-utility-solutions/NO 1 (5).mp4' },
      { id: 'abs-02', title: 'Reel 02', video: '../videos/abs-utility-solutions/NO 2 (3).mp4' },
      { id: 'abs-03', title: 'Reel 03', video: '../videos/abs-utility-solutions/NO 3 (2).mp4' },
      { id: 'abs-04', title: 'Reel 04', video: '../videos/abs-utility-solutions/NO 4 (2).mp4' }
    ],
    nextProject: { name: 'PST Construction', url: 'pst-construction.html' }
  },

  'pst-construction': {
    id: 'pst-construction',
    name: 'PST Construction',
    pageName: 'PST Construction',
    handle: '@pstconstruction',
    category: 'SOCIAL MEDIA MARKETING',
    description: 'Construction and interiors — project showcases and trust-building content.',
    overview: 'Digital marketing and brand positioning strategy that transformed a local construction company into a recognized industry brand with a strong online lead pipeline.',
    services: ['Brand Identity', 'Website Design', 'SEO', 'Social Media Marketing'],
    stats: [
      { target: 90, suffix: 'K+', label: 'Views' },
      { target: 12, suffix: 'K+', label: 'Followers' },
      { target: 2, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/pst-construction.svg',
    cover: '../images/clients/pst-construction.svg',
    reels: [
      { id: 'pst-01', title: 'Reel 01', video: '../videos/pst-construction/NO 1 (6).mp4' },
      { id: 'pst-02', title: 'Reel 02', video: '../videos/pst-construction/NO 2 (4).mp4' },
      { id: 'pst-03', title: 'Reel 03', video: '../videos/pst-construction/no 3.mp4' },
      { id: 'pst-04', title: 'Reel 04', video: '../videos/pst-construction/no 4.mp4' }
    ],
    nextProject: { name: 'Tikka2Taco', url: 'tikka2tacco.html' }
  },

  'urs-choice': {
    id: 'urs-choice',
    name: 'Urs Choice',
    pageName: 'Urs Choice',
    handle: '@urs.choice',
    category: 'SOCIAL MEDIA + WEB DEVELOPMENT',
    description: 'Specialised retail — launches, offers and engaging in-store content.',
    overview: 'Strategic digital transformation with a focus on content marketing, web presence, and lead generation systems that scaled their customer base exponentially.',
    services: ['Web Development', 'Social Media Marketing', 'SEO', 'Content Creation'],
    stats: [
      { target: 200, suffix: 'K+', label: 'Views' },
      { target: 35, suffix: 'K+', label: 'Followers' },
      { target: 4, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/urs-choice.svg',
    cover: '../images/clients/urs-choice.svg',
    reels: [
      { id: 'urs-01', title: 'Reel 01', video: '../videos/urs-choice/NO 1 (3).mp4' },
      { id: 'urs-02', title: 'Reel 02', video: '../videos/urs-choice/NO 2 (2).mp4' },
      { id: 'urs-03', title: 'Reel 03', video: '../videos/urs-choice/NO 3 (1).mp4' }
    ],
    nextProject: { name: 'Tikka2Taco', url: 'tikka2tacco.html' }
  },

  'tikka2tacco': {
    id: 'tikka2tacco',
    name: 'Tikka2Taco',
    pageName: 'Tikka2Tacco',
    handle: '@tikka2tacco',
    category: 'SOCIAL MEDIA MARKETING',
    description: 'Fusion eats — bold food marketing, viral reels and performance-driven ad creative.',
    overview: 'End-to-end digital marketing and content production including viral video campaigns that generated massive brand awareness and customer acquisition.',
    services: ['Video Production', 'Social Media Marketing', 'Content Creation', 'Meta Ads'],
    stats: [
      { target: 180, suffix: 'K+', label: 'Views' },
      { target: 30, suffix: 'K+', label: 'Followers' },
      { target: 3.5, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/tikka2tacco.svg',
    cover: '../images/clients/tikka2tacco.svg',
    reels: [
      { id: 't2t-01', title: 'Reel 01', video: '../videos/tikka2tacco/NO 1 (2).mp4' },
      { id: 't2t-02', title: 'Reel 02', video: '../videos/tikka2tacco/NO 2 (1).mp4' },
      { id: 't2t-03', title: 'Reel 03', video: '../videos/tikka2tacco/NO 3.mp4' },
      { id: 't2t-04', title: 'Reel 04', video: '../videos/tikka2tacco/NO 4 (1).mp4' }
    ],
    nextProject: { name: 'Le Brew', url: 'le-brew.html' }
  },

  'le-brew': {
    id: 'le-brew',
    name: 'Le Brew',
    pageName: 'Le Brew',
    handle: '@lebrew.cafe',
    category: 'VIDEO PRODUCTION',
    description: 'Premium coffee experience — brand storytelling, lifestyle and promotional reels.',
    overview: 'Full-scale digital marketing campaign focused on brand storytelling, social media growth, and content strategy that established Le Brew as a premium coffee brand.',
    services: ['Brand Strategy', 'Video Production', 'Social Media Marketing', 'Content Creation'],
    stats: [
      { target: 120, suffix: 'K+', label: 'Views' },
      { target: 18, suffix: 'K+', label: 'Followers' },
      { target: 2.5, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/le-brew.svg',
    cover: '../images/clients/le-brew-cafe-cover.png',
    reels: [
      { id: 'lebrew-01', title: 'Customer Reviews', video: '../videos/le-brew/NO 07 REVIEWS .mp4' },
      { id: 'lebrew-02', title: 'Bride to Be', video: '../videos/le-brew/NO 09 BRIDE TO BE “.mp4' },
      { id: 'lebrew-03', title: 'Voice Over Spot', video: '../videos/le-brew/NO 13 VOICE OVER _.mp4' },
      { id: 'lebrew-04', title: 'Overloaded', video: '../videos/le-brew/NO 15 OVERLOADED _.mp4' }
    ],
    nextProject: { name: 'Dhiya Garments', url: 'dhiya-garments.html' }
  },

  'dhiya-garments': {
    id: 'dhiya-garments',
    name: 'Dhiya Garments',
    pageName: 'Dhiya Garments',
    handle: '@dhiyagarments',
    category: 'VIDEO PRODUCTION',
    description: 'Fashion and textiles — collections, styling and shopping-directed visuals.',
    overview: 'E-commerce focused digital strategy with product photography, social media catalogs, and targeted ad campaigns that boosted online sales and brand recognition.',
    services: ['E-commerce Strategy', 'Video Production', 'Product Photography', 'Social Media Marketing'],
    stats: [
      { target: 5, suffix: 'M+', label: 'Views' },
      { target: 20, suffix: 'K', label: 'Followers' },
      { target: 10, suffix: '*', label: 'Growth' }
    ],
    logo: '../images/clients/dhiya-garments.svg',
    cover: '../images/clients/dhiya-garments.svg',
    reels: [
      { id: 'dhiya-01', title: 'Reel 01', video: '../videos/dhiya-garments/NO 1.MP4' },
      { id: 'dhiya-02', title: 'Reel 02', video: '../videos/dhiya-garments/NO 4.MP4' },
      { id: 'dhiya-03', title: 'Reel 03', video: '../videos/dhiya-garments/NO 6.MP4' },
      { id: 'dhiya-04', title: 'Reel 04', video: '../videos/dhiya-garments/NO 7.MP4' }
    ],
    nextProject: { name: 'Break Time Restaurant', url: 'break-time-restaurant.html' }
  },

  'break-time-restaurant': {
    id: 'break-time-restaurant',
    name: 'Break Time Restaurant',
    pageName: 'Break Time Restaurant',
    handle: '@breaktimerestaurant',
    category: 'VIDEO PRODUCTION',
    description: 'Restaurant specials and vibes — quick, catchy content that converts.',
    overview: 'Complete digital makeover including visual identity, social media management, and promotional content that significantly increased restaurant bookings and online orders.',
    services: ['Brand Identity', 'Video Production', 'Social Media Marketing', 'Content Creation'],
    stats: [
      { target: 130, suffix: 'K+', label: 'Views' },
      { target: 19, suffix: 'K+', label: 'Followers' },
      { target: 2.6, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/break-time-restaurant.svg',
    cover: '../images/clients/break-time-restaurant.svg',
    reels: [
      { id: 'bt-01', title: 'Reel 01', video: '../videos/break-time-restaurant/NO 1 (1).mp4' },
      { id: 'bt-02', title: 'Reel 02', video: '../videos/break-time-restaurant/NO 2.mp4' }
    ],
    nextProject: { name: 'Jacob', url: 'jacob.html' }
  },

  'jacob': {
    id: 'jacob',
    name: 'Jacob',
    pageName: 'Jacob',
    handle: '@jacob.finance',
    category: 'VIDEO PRODUCTION',
    description: 'Markets and money — finance explainers and market analysis visuals.',
    overview: 'Dynamic digital presence for stock market and finance production, featuring professional video content, market analysis visuals, and targeted social media campaigns that established credibility and attracted a premium investor audience.',
    services: ['Video Production', 'Social Media Marketing', 'Brand Identity', 'Content Strategy'],
    stats: [
      { target: 500, suffix: 'K+', label: 'Views' },
      { target: 80, suffix: 'K+', label: 'Followers' },
      { target: 4, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/jacob.svg',
    cover: '../images/clients/jacob.svg',
    reels: [
      { id: 'jacob-01', title: 'Reel 01', video: '../videos/jacob/NO - 1.mp4' },
      { id: 'jacob-02', title: 'Reel 02', video: '../videos/jacob/NO - 2 .mp4' },
      { id: 'jacob-03', title: 'Reel 03', video: '../videos/jacob/NO - 3.mp4' },
      { id: 'jacob-04', title: 'Reel 04', video: '../videos/jacob/NO - 4.mp4' }
    ],
    nextProject: { name: 'SMP Food Products', url: 'smp-food-products.html' }
  },

  'smp-food-products': {
    id: 'smp-food-products',
    name: 'SMP Food Products',
    pageName: 'SMP Food Products',
    handle: '@smpfoodproducts',
    category: 'WEB DEVELOPMENT',
    description: 'Product marketing and creative social content for organic food mixes and natural malts.',
    overview: 'Comprehensive digital strategy for organic food mix and malt products, including brand storytelling, social media marketing, and content creation that elevated their market presence and drove significant consumer engagement.',
    services: ['Social Media Marketing', 'Web Development', 'Content Creation', 'Brand Identity'],
    stats: [
      { target: 200, suffix: 'K+', label: 'Reach' },
      { target: 45, suffix: 'K+', label: 'Followers' },
      { target: 2, suffix: 'x', label: 'Engagement' }
    ],
    logo: '../images/clients/smp-food-products.svg',
    cover: '../images/clients/smp-food-products-cover.png',
    reels: [
      { id: 'smp-01', title: 'Nendran Malt', video: '../videos/smp-food-products/NO 1 NENDRAN MALT _.mp4' },
      { id: 'smp-02', title: 'Mudavattukal Mix', video: '../videos/smp-food-products/NO 2 MUDAVATTUKAL MIX _.mp4' },
      { id: 'smp-03', title: 'Red Banana Malt', video: '../videos/smp-food-products/NO 5 RED BANANA MALT _.mp4' },
      { id: 'smp-04', title: 'Dates Powder', video: '../videos/smp-food-products/NO 6 DATES POWDER “.mp4' }
    ],
    nextProject: { name: 'Vaigai Namma Taxi', url: 'vaigai-namma-taxi.html' }
  },

  'bon-appetite': {
    id: 'bon-appetite',
    name: 'Bon Appetite',
    pageName: 'Bon Appetite',
    handle: '@bon.appetite',
    category: 'VIDEO PRODUCTION',
    description: 'Restaurant and dining — appetizing reels that drive footfall and orders.',
    overview: 'Complete digital presence overhaul including social media marketing, content creation, and video production that drove a 3x increase in online engagement and foot traffic.',
    services: ['Social Media Marketing', 'Content Creation', 'Video Production', 'Brand Identity'],
    stats: [
      { target: 150, suffix: 'K+', label: 'Views' },
      { target: 25, suffix: 'K+', label: 'Followers' },
      { target: 3, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/bon-appetite.svg',
    cover: '../images/clients/bon-appetite.svg',
    reels: [
      { id: 'bon-01', title: 'Reel 01', video: '../videos/bon-appetite/NO 13.mp4' },
      { id: 'bon-02', title: 'Reel 02', video: '../videos/bon-appetite/NO 15.mp4' },
      { id: 'bon-03', title: 'Reel 03', video: '../videos/bon-appetite/NO 5.mp4' },
      { id: 'bon-04', title: 'Reel 04', video: '../videos/bon-appetite/NO 7 (1).mp4' }
    ],
    nextProject: { name: 'Fun Spot', url: 'fun-spot.html' }
  },

  'fun-spot': {
    id: 'fun-spot',
    name: 'Fun Spot',
    pageName: 'Fun Spot',
    handle: '@funspot',
    category: 'VIDEO PRODUCTION',
    description: 'Games and entertainment — high-energy content for non-stop fun.',
    overview: 'Vibrant social media campaigns and content creation that amplified Fun Spot\'s brand presence and drove record attendance through targeted digital engagement.',
    services: ['Social Media Marketing', 'Video Production', 'Content Creation', 'Event Marketing'],
    stats: [
      { target: 140, suffix: 'K+', label: 'Views' },
      { target: 22, suffix: 'K+', label: 'Followers' },
      { target: 3.2, suffix: 'x', label: 'Growth' }
    ],
    logo: '../images/clients/fun-spot.svg',
    cover: '../images/clients/fun-spot.svg',
    reels: [
      { id: 'fun-01', title: 'Reel 01', video: '../videos/fun-spot/NO 1 (4).mp4' }
    ],
    nextProject: { name: 'Bon Appetite', url: 'bon-appetite.html' }
  },

  'vaigai-namma-taxi': {
    id: 'vaigai-namma-taxi',
    name: 'Vaigai Namma Taxi',
    pageName: 'Vaigai Namma Taxi',
    handle: '@vaigainammataxi',
    category: 'WEB DEVELOPMENT',
    description: 'Local taxi service — a modern booking website and lead-generation web presence.',
    overview: 'A clean, performance-focused website built for Vaigai Namma Taxi to put their fleet front-and-center, capture ride inquiries, and turn online visitors into bookings and calls.',
    services: ['Web Development', 'Website Design', 'Lead Generation', 'SEO'],
    stats: [],
    logo: '',
    cover: '',
    reels: [],
    nextProject: { name: 'The Normal Agency', url: 'the-normal-agency.html' }
  },

  'the-normal-agency': {
    id: 'the-normal-agency',
    name: 'The Normal Agency',
    pageName: 'The Normal Agency',
    handle: '@thenormalagency',
    category: 'AI AUTOMATION',
    description: 'AI automation — email and sales workflows that qualify, follow up and close.',
    overview: 'AI-powered automation for a growing agency — email and sales workflows that qualify leads, follow up automatically and make the team more productive.',
    services: ['Email Automation', 'Sales Automation', 'Workflow Automation', 'AI Integration'],
    stats: [],
    logo: '',
    cover: '',
    reels: [],
    nextProject: { name: 'Domains Business', url: 'domains-business.html' }
  },

  'domains-business': {
    id: 'domains-business',
    name: 'Domains Business',
    pageName: 'Domains Business',
    handle: '@domainsbusiness',
    category: 'WEB DEVELOPMENT',
    description: 'Website and domain services — a fast, trustworthy storefront and digital identity solutions.',
    overview: 'A website and domain services business positioning itself online — building a fast, trustworthy storefront for domain registration, hosting and digital identity solutions.',
    services: ['Web Development', 'Website Design', 'Brand Identity', 'SEO'],
    stats: [],
    logo: '',
    cover: '',
    reels: [],
    nextProject: { name: 'Urs Choice', url: 'urs-choice.html' }
  }
};