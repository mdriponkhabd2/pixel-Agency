import { Service, ServicePackage, PortfolioItem, Testimonial, FAQ, WebsiteSettings } from "./types";

export const STATIC_SERVICES: Service[] = [
  {
    id: "graphic-design",
    name: "Graphic Design",
    slug: "graphic-design",
    icon: "Palette",
    bannerUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Elevate your branding with our ultra-clean, high-impact minimalist visual design assets.",
    description: "Our world-class design studio crafts premium visual brand languages that stand out in crowded digital markets. From sophisticated vector layouts to complete corporate identity kits, we deliver pure design excellence engineered for conversions."
  },
  {
    id: "video-editing",
    name: "Video Editing",
    slug: "video-editing",
    icon: "Film",
    bannerUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Premium cinematic narrative editing and fast-paced high-retention viral content production.",
    description: "Capture attention within seconds with our industry-level editing suites. We master color grading, sleek match cuts, responsive sound design, and elegant kinetic typography optimized specifically for high retention across YouTube, TikTok, and social campaigns."
  },
  {
    id: "web-design",
    name: "Web Design",
    slug: "web-design",
    icon: "Monitor",
    bannerUrl: "https://images.unsplash.com/photo-1547658719-da2b81169b44?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Ultra-fast, responsive web interfaces built with elegant typography and fluid transitions.",
    description: "We build fully responsive, premium corporate platforms and luxury multi-page websites that marry aesthetics with absolute high performance. Perfect responsiveness, fast-loading clean architecture, and fluid micro-animations come standard with every build."
  },
  {
    id: "landing-page",
    name: "Landing Page",
    slug: "landing-page",
    icon: "Layers",
    bannerUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Sleek, conversion-optimized landing pages engineered to drive massive client actions.",
    description: "Our high-performance single-page sales and copy platforms leverage psychological visual paths, clear copy structure, and elegant call-to-actions. Designed specifically for SaaS, real estate products, agency growth, and service businesses looking to convert cold ads."
  },
  {
    id: "social-media-growth",
    name: "Social Media Growth",
    slug: "social-media-growth",
    icon: "TrendingUp",
    bannerUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Accelerate your social authority and organic reach with data-driven audience acquisition strategies.",
    description: "Establish digital dominance. We manage your content schedule, optimize viral keywords, design premium high-CTR thumbnails, and formulate real biological marketing funnels to skyrocket qualified leads and organic views across TikTok, YouTube, and Instagram."
  },
  {
    id: "domain-hosting",
    name: "Domain & Hosting",
    slug: "domain-hosting",
    icon: "Globe",
    bannerUrl: "https://images.unsplash.com/photo-1596495578065-6e076b8df1d8?auto=format&fit=crop&q=80&w=1200",
    shortDescription: "Ultra-secure domain registration, high-speed cloud hosting, and instant DNS configurations.",
    description: "Secure your unique identity on the web with our high-performance DNS routing, lightning-fast SSD storage, and redundant Cloud Hosting servers. Includes automated daily backups, free SSL certificates, and premium protection."
  }
];

export const STATIC_PACKAGES: ServicePackage[] = [
  // Graphic Design Packages
  {
    id: "gd-basic",
    serviceId: "graphic-design",
    name: "Basic Package",
    price: 199,
    description: "Perfect for emerging startups seeking high-quality brand assets and elegant foundational items.",
    features: [
      "1 Custom Premium Logo Design",
      "2 Beautiful Social Media Templates",
      "Vector Source Files included (SVG/AI)",
      "2 Interactive Revision Rounds",
      "Standard 3-Day Delivery Cycle"
    ],
    enabled: true
  },
  {
    id: "gd-standard",
    serviceId: "graphic-design",
    name: "Standard Package",
    price: 499,
    description: "Our most popular corporate tier providing a cohesive, professional brand identity language.",
    features: [
      "3 Alternative Logo Concepts",
      "Complete Visual Branding Guideline Book",
      "6 Customized Social Media templates",
      "Double-sided Business Card & Letterhead",
      "Unlimited Revision Cycles",
      "Expedited 2-Day Priority Delivery"
    ],
    enabled: true
  },
  {
    id: "gd-premium",
    serviceId: "graphic-design",
    name: "Premium Package",
    price: 999,
    description: "A complete visual design takeover delivering ultra-premium corporate luxury assets.",
    features: [
      "Deluxe Logo Architecture & Animated Logo",
      "Complete Premium Corporate Visual System",
      "15 Modular Social Media Assets",
      "Premium Merchandise & App Packaging Designs",
      "Dedicated VIP Creative Director Support",
      "1-on-1 Strategy Workshop Session"
    ],
    enabled: true
  },

  // Video Editing Packages
  {
    id: "ve-basic",
    serviceId: "video-editing",
    name: "Basic Package",
    price: 149,
    description: "Perfect for high-impact social media reels, tik-toks, or short promo highlight feeds.",
    features: [
      "Up to 60-Second Short Video Formats",
      "Sound FX & Licensing Selection Track",
      "Premium Subtitles & Subtext Animation",
      "Color Correction & Base Grade",
      "2 Collaborative Client Revisions"
    ],
    enabled: true
  },
  {
    id: "ve-standard",
    serviceId: "video-editing",
    name: "Standard Package",
    price: 449,
    description: "Complete professional edits optimized for structured YouTube uploads or software walkthroughs.",
    features: [
      "Up to 10 Minutes Cinematic Cut",
      "Motion Graphics & Intro/Outro Design",
      "Advanced Sound Design & Beat Synchronization",
      "Vibrant High-Contrast Color Grading",
      "Unlimited Collaborative Revisions",
      "Includes Source Timeline File"
    ],
    enabled: true
  },
  {
    id: "ve-premium",
    serviceId: "video-editing",
    name: "Premium Package",
    price: 1299,
    description: "Enterprise-grade elite production for high-budget trailers, courses, or TV commercial assets.",
    features: [
      "Any length of edit (Up to 30 Minutes)",
      "Bespeaking Narrative Directing & Custom Motion Effects",
      "Ultimate Soundscape Design (ASMR, Cinematic Ambient)",
      "Elite Hollywood Grade Color Correction (DaVinci workflow)",
      "Ultra-Fast 24-Hour Expedited Delivery Option",
      "Full Video Campaign Advertising Strategy"
    ],
    enabled: true
  },

  // Web Design Packages
  {
    id: "wd-basic",
    serviceId: "web-design",
    name: "Basic Package",
    price: 799,
    description: "A stunning, responsive portfolio website establishing immediate digital authority.",
    features: [
      "Up to 3 Premium Multi-sections Pages",
      "Fully Responsive Mobile Layout Layout",
      "Basic Search Engine Optimization Structure",
      "Live Contact Request Submission Forms",
      "1 Month Complementary Hosting Setup Support"
    ],
    enabled: true
  },
  {
    id: "wd-standard",
    serviceId: "web-design",
    name: "Standard Package",
    price: 1799,
    description: "The complete premium corporate website designed for modern dynamic scaling enterprises.",
    features: [
      "Up to 8 Fully Styled Sub-pages",
      "Custom Animated Dynamic Interactivities",
      "Advanced SEO & Speed Enhancement (95+ score)",
      "Interactive Admin Content Management Module",
      "Google Analytics & Facebook Pixel Setup",
      "6 Months Premium Live Support Service"
    ],
    enabled: true
  },
  {
    id: "wd-premium",
    serviceId: "web-design",
    name: "Premium Package",
    price: 3499,
    description: "Custom headless enterprise software platform incorporating premium interactive features.",
    features: [
      "Unlimited Bespoke Structural Web Pages",
      "Interactive Database & Dashboard Systems",
      "High-Grade Advanced Animation Frameworks",
      "Custom API & Third-party Service Syncs",
      "Comprehensive Cyber Threat Protection Setup",
      "Lifetime Critical Care Support Agreement"
    ],
    enabled: true
  },

  // Landing Page Packages
  {
    id: "lp-basic",
    serviceId: "landing-page",
    name: "Basic Package",
    price: 399,
    description: "A high-conversion light single-section landing page perfect for capturing lead details.",
    features: [
      "1 Long-form Responsive Content Layout",
      "Focused Value Proposition Architecture",
      "Contact Leads Data Capture System",
      "Basic Page Loading Speed Optimizations",
      "3 Comprehensive Quality Revisions"
    ],
    enabled: true
  },
  {
    id: "lp-standard",
    serviceId: "landing-page",
    name: "Standard Package",
    price: 899,
    description: "Premium SaaS or high-conversion product sales and subscription optimization page.",
    features: [
      "Ultra-persuasive Copywriting Structure Assistance",
      "Bespoke Responsive Layout Icons and Asset Elements",
      "Integrated Customer FAQ accordion segment",
      "Custom Social Testimonial Grid Sections",
      "Direct Native Analytics & CRM connections",
      "Unlimited Multi-device Polish Cycles"
    ],
    enabled: true
  },
  {
    id: "lp-premium",
    serviceId: "landing-page",
    name: "Premium Package",
    price: 1499,
    description: "A comprehensive lead generation funnel machine including integrated pricing tables and reviews.",
    features: [
      "Multi-variation Conversion Copy Layouts",
      "Custom Particle/Interactive Background Accents",
      "A/B Split Test Friendly Setup",
      "Video Overlay Hooks & Mockup Screen Components",
      "Priority Fast-lane 48 Hour Completion",
      "1 Hour Conversion Copy Coaching Consultation"
    ],
    enabled: true
  },

  // Social Media Growth Packages
  {
    id: "smg-basic",
    serviceId: "social-media-growth",
    name: "Basic Package",
    price: 299,
    description: "Kickstart your social platforms with targeted growth optimizations and beautiful layouts.",
    features: [
      "Organic Growth Blueprint & Schedule Planning",
      "Professional Bio Optimization & Banner Makeovers",
      "Guaranteed 500+ Real Organic Followers/Views",
      "5 Optimized Hashtag & Viral Keyword Lists",
      "Live Engagement Tracking Reports"
    ],
    enabled: true
  },
  {
    id: "smg-standard",
    serviceId: "social-media-growth",
    name: "Standard Package",
    price: 699,
    description: "Accelerate authority with expert viral planning, asset design, and subscriber magnets.",
    features: [
      "Fully Managed Dynamic Posting Plan (12 posts/mo)",
      "Guaranteed 1,500+ Real High-Quality Followers",
      "Premium High-CTR Story/Thumbnail Design",
      "Targeted Niche Audience Interaction Loops",
      "Bi-weekly Review Zoom Session Calls",
      "Competitor Tactics Intelligence Reports"
    ],
    enabled: true
  },
  {
    id: "smg-premium",
    serviceId: "social-media-growth",
    name: "Premium Package",
    price: 1599,
    description: "The complete multi-channel agency takeover. Dominating TikTok, Instagram, and YouTube.",
    features: [
      "Full Brand Management & Content Creation Loop",
      "Guaranteed 5,000+ Verified Organic Followers",
      "3 Done-with-You Customized Viral Script Pipelines",
      "VIP Brand Collabs & PR Press Integrations",
      "Weekly SEO Metrics & Conversions Review",
      "Dedicated Growth Account Manager 24/7"
    ],
    enabled: true
  },

  // Domain & Hosting Packages
  {
    id: "host-starter",
    serviceId: "domain-hosting",
    name: "Starter Shared",
    price: 1.99,
    description: "Great for new blogs and static professional landings requiring fast SSD space.",
    features: [
      "1 Free Standard Domain Search",
      "10GB Premium High-Speed SSD",
      "Unlimited Free SSL Certificate",
      "Automated Daily DB Backups",
      "24/7 Technical Support Ticket"
    ],
    enabled: true
  },
  {
    id: "host-cloud",
    serviceId: "domain-hosting",
    name: "Pro Cloud Hosting",
    price: 4.99,
    description: "Best for growing portals, custom web architectures, and multiple high-traffic brand landings.",
    features: [
      "Hosting for 5 Dynamic Websites",
      "50GB NVMe Lightning-Storage",
      "Free SSL & Shield DDoS Security",
      "Git Integration & staging spaces",
      "Priority WhatsApp Support Line"
    ],
    enabled: true
  },
  {
    id: "host-dedicated",
    serviceId: "domain-hosting",
    name: "Enterprise VPS Node",
    price: 19.99,
    description: "Dedicated resources for massive visual agencies and automated high-load software solutions.",
    features: [
      "Fully Dedicated VPS Resource Node",
      "200GB Pure SSD NVMe Space",
      "Full Root Administration Access",
      "Advanced CDN Edge Proxies Shield",
      "Dedicated Visual Engineer Support"
    ],
    enabled: true
  }
];

export const STATIC_PORTFOLIO: PortfolioItem[] = [
  {
    id: "port-1",
    title: "Nova Pay Branding Strategy",
    serviceId: "graphic-design",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    description: "Complete luxury minimalist vector corporate visual identity and system for an international fintech app."
  },
  {
    id: "port-2",
    title: "Zenith Studio Promotional Reel",
    serviceId: "video-editing",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600",
    description: "High-adrenaline kinetic narrative edit utilizing advanced visual overlays and customized audio synchronization."
  },
  {
    id: "port-3",
    title: "Vortex SaaS Core Portal",
    serviceId: "web-design",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    description: "A dark high-performance React dashboard with smooth responsive state charts, fast canvas widgets, and modern vibes."
  },
  {
    id: "port-4",
    title: "Aqua CRM Sales Pipeline",
    serviceId: "landing-page",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    description: "A single-page marketing landing page yielding an astounding 28.6% conversion traffic increase on targeted cold ads."
  }
];

export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    clientName: "David Miller",
    clientRole: "Operations VP",
    company: "Vortex Ltd",
    rating: 5,
    comment: "Pixel Agency upgraded our complete visual branding. Our digital conversion rates jumped over 40% in just six weeks! Exceptional craftsmanship.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-2",
    clientName: "Samantha Chen",
    clientRole: "Growth Lead",
    company: "Apex Tech",
    rating: 5,
    comment: "Their video editing and viral growth plan for our TikTok account was incredible. We hit 100k views on our very first project. Pure creative geniuses!",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-3",
    clientName: "Jonathan Vance",
    clientRole: "Founding Partner",
    company: "Aether Fin",
    rating: 5,
    comment: "Our new landing page is visually mesmerizing. Speed is hyper-fast, mobile responsiveness is flawless, and the dark styled interface looks absolutely superb.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-4",
    clientName: "Michael Ahn",
    clientRole: "Founder",
    company: "Solaria",
    rating: 5,
    comment: "The graphic design suite provided by Pixel Agency redefined our branding guidelines. Their designers are incredibly gifted.",
    avatarUrl: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-5",
    clientName: "Emily Watson",
    clientRole: "Creative Director",
    company: "Bloom Media",
    rating: 5,
    comment: "An exceptional aesthetic! They edited our high-retention commercial promos with kinetic captions and flawless timing.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-6",
    clientName: "Liam O'Connor",
    clientRole: "CTO",
    company: "Zenith Web",
    rating: 5,
    comment: "Their web design expertise is phenomenal. Our corporate landing page load speed went down to 0.4 seconds.",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-7",
    clientName: "Sarah Jenkins",
    clientRole: "Marketing VP",
    company: "Organic Reach",
    rating: 5,
    comment: "We ordered the standard social media growth package and saw a 300% boost in organic engagement inside Austagram and beyond.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-8",
    clientName: "Tariq Rahman",
    clientRole: "Managing Director",
    company: "Bengal Tech",
    rating: 5,
    comment: "Pixel Agency is easily the best elite design agency. They are proactive, professional, and deliver unmatched value.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-9",
    clientName: "Chloe Dupont",
    clientRole: "Art Director",
    company: "Lux Studio",
    rating: 5,
    comment: "Absolute luxury design parameters! Every vector asset is bespoke and perfectly matches our identity.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-10",
    clientName: "Marcus Brody",
    clientRole: "VP of Sales",
    company: "Apex Properties",
    rating: 5,
    comment: "The conversion-optimized real estate landing pages they developed have completely revamped our sales pipeline.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  }
];

export const STATIC_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How long does a premium Web Design project take to build?",
    answer: "A standard elegant multi-stage website usually takes between 10-21 business days. Custom complex software portals with heavy database systems scale from 3-5 weeks depending on exact spec metrics."
  },
  {
    id: "faq-2",
    question: "Will the pricing packages ever change dynamically?",
    answer: "Our pricing packages and custom features can be managed by the agency team or run stably directly from static configuration records for optimal loading velocity on Vercel CDN nodes."
  },
  {
    id: "faq-3",
    question: "Do you offer full 24/7 post-deployment support and care?",
    answer: "Absolutely! We pride ourselves on offering live support on all packages, with premium and enterprise tiers backed by a 24/7 priority SLA."
  }
];

export const STATIC_SETTINGS: WebsiteSettings = {
  address: "Jamtoli, Austagram, Kishoreganj-2380",
  whatsapp: "01837679963",
  liveChatEnabled: true,
  seoTitle: "Pixel Agency - Elite Digital Services",
  seoKeywords: "graphic design, video editing, web design, landing page, social media growth, austagram agency",
  seoDescription: "World class web design, landing page development, high-retention video editing and social growth services.",
  heroTitle: "Grow Your Business With Professional Digital Services",
  heroSubtitle: "We provide world-class Graphic Design, Video Editing, Web Design, Landing Page Development, and Social Media Growth Services. Experience high-end technical design.",
  heroImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  logoImageUrl: "",
  aboutImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  aboutTitle: "THE DIGITAL ARCHITECT CREW",
  aboutContent: "Founded initially as a micro visual group in Jamtoli, Austagram, Kishoreganj, Pixel Agency has transformed into an international digital agency. We align conversions, premium design parameters, and ultra-high speed software systems under a single design language. We completely reject low value template builders in favor of bespoke visual architectures.",
  domainRegistrationUrl: "https://host.amarshebahost.com/cart.php?a=add&domain=register&query=",
  bdixHostingUrl: "https://host.amarshebahost.com",
  usaHostingUrl: "https://host.amarshebahost.com",
  singaporeHostingUrl: "https://host.amarshebahost.com",
  germanyHostingUrl: "https://host.amarshebahost.com",
  bdixResellerUrl: "https://host.amarshebahost.com",
  usaResellerUrl: "https://host.amarshebahost.com",
  singaporeResellerUrl: "https://host.amarshebahost.com",
  germanyResellerUrl: "https://host.amarshebahost.com",
  domainPricingUrl: "https://host.amarshebahost.com",
  domainTransferUrl: "https://host.amarshebahost.com",
  domainDnsCheckerUrl: "https://host.amarshebahost.com"
};
