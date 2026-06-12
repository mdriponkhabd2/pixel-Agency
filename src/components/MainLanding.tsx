import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Award, CheckCircle2, Star, Plus, ShieldCheck, Compass, Briefcase, TrendingUp } from "lucide-react";
import { Service, Testimonial, PortfolioItem, ServicePackage, WebsiteSettings } from "../types";

interface MainLandingProps {
  services: Service[];
  testimonials: Testimonial[];
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  onNavigate: (route: string) => void;
  settings?: WebsiteSettings;
}

export default function MainLanding({
  services,
  testimonials,
  portfolio,
  packages,
  onNavigate,
  settings
}: MainLandingProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [emailSub, setEmailSub] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  // Testimonials Carousel Controls
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      let count = 4;
      if (window.innerWidth >= 1024) {
        count = 4;
      } else if (window.innerWidth >= 768) {
        count = 3;
      } else if (window.innerWidth >= 640) {
        count = 2;
      } else {
        count = 1;
      }
      setVisibleCount(count);

      // Adjust index if out of bounds on resize
      const nextMax = testimonials.length > count ? testimonials.length - count : 0;
      setCurrentIndex((prev) => Math.min(prev, nextMax));
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [testimonials.length]);

  const maxIndex = testimonials.length > visibleCount ? testimonials.length - visibleCount : 0;

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Wrap around to first slide
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Wrap around to last slide
      }
      return prev - 1;
    });
  };

  // Auto-play slider transitions, pauses on user hover
  useEffect(() => {
    if (isHovered || testimonials.length <= visibleCount) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, testimonials.length, visibleCount, maxIndex]);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setEmailSub("");
    }, 4000);
  };

  const whyChooseUsStats = [
    {
      icon: Zap,
      title: "Hyper-Velocity Speed",
      desc: "Our optimized pipelines yield production assets in as little as 24-48 hours without dropping core visual standards."
    },
    {
      icon: Award,
      title: "Award Winning Craft",
      desc: "Engineered by senior visual designers and SaaS architects centering pure high-contrast premium luxury layouts."
    },
    {
      icon: ShieldCheck,
      title: "Guaranteed Retention",
      desc: "Video editing and landing copy is structured mathematically utilizing psychological visual paths and conversion hooks."
    }
  ];

  const processSteps = [
    { stage: "01", title: "Strategy Alignment", desc: "Aligning creative timelines and establishing brand specifications during a visual workshop." },
    { stage: "02", title: "Creative Production", desc: "Producing cinematic video timelines, luxury brand identity concepts, or interactive components." },
    { stage: "03", title: "Conversion Polish", desc: "Hardening layouts, A/B copy optimizing files, and accelerating mobile speeds." },
    { stage: "04", title: "Live Deployment", desc: "Transferring source code vectors, scheduling campaigns, and initiating 24/7 priority support." }
  ];

  const statCounters = [
    { count: "98%", label: "Conversion Satisfied" },
    { count: "450+", label: "Delivered Platforms" },
    { count: "14M+", label: "Organic Audience Reached" },
    { count: "24/7", label: "Live Client Support Chat" }
  ];

  const faqItems = [
    {
      q: "Where is Pixel Agency located?",
      a: "Our core physical head office is established at Jamtoli, Austagram, Kishoreganj-2380. However, we service corporate enterprise projects globally."
    },
    {
      q: "How does the dynamic pricing database system work?",
      a: "Our SaaS packages are loaded instantly from our server. Agency admins can overwrite package names, feature checklists, and pricing scales inside the dynamic admin panel, instantly reflecting active rates."
    },
    {
      q: "Can I customize the features of an individual package?",
      a: "Yes! Connecting with our staff via the floating WhatsApp CTA button allows you to negotiate completely tailor-made briefs. Admins can also add unique systems directly."
    }
  ];

  return (
    <div className="font-sans text-gray-300" id="main-landing-viewport">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[92vh] bg-[#000000]">
        {/* Dynamic Background Image Override */}
        {settings?.heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={settings.heroImageUrl} 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-20 filter grayscale contrast-125 select-none" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
        )}

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-radial-gradient(circle at 10% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 60%)" />
        <div className="absolute inset-0 bg-radial-gradient(circle at 90% 80%, rgba(255, 107, 0, 0.04) 0%, transparent 70%)" />
        
        {/* Visual mesh lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-4xl text-center md:text-left space-y-6">
            
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-sm text-brand text-xs font-mono tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 bg-brand rounded-none rotate-45 animate-ping shrink-0" />
              <span>STRICTLY PREMIUM AGENCY ECOSYSTEM</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-white leading-tight uppercase">
              {settings?.heroTitle || "Grow Your Business With Professional Digital Services"}
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed font-light">
              {settings?.heroSubtitle || "We provide world-class Graphic Design, Video Editing, Web Design, Landing Page Development, and Social Media Growth Services. Experience high-end technical design."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center pt-4 gap-4 justify-center md:justify-start">
              <button
                onClick={() => onNavigate("pricing")}
                className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-black py-4 px-8 rounded-sm font-black font-display tracking-widest text-xs transition-all uppercase cursor-pointer focus:outline-none"
              >
                Get Started
              </button>
              
              <button
                onClick={() => {
                  const element = document.getElementById("services-grid-anchor");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 py-4 px-8 rounded-sm font-bold font-display tracking-widest text-xs transition-all uppercase cursor-pointer"
              >
                View Services
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="bg-dark-bg py-24 border-t border-gray-800" id="services-grid-anchor">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-2">
              <span className="text-brand font-mono text-xs tracking-widest uppercase block font-semibold">Our Capabilities</span>
              <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase">
                Specialized Creative Disciplines
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed font-light">
              Every deliverable is crafted from scratch. We ignore templates in favor of tailored conversion psychology solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((item) => {
              // Get Icon by string mapping
              let IconComp = Compass;
              if (item.id === "graphic-design") IconComp = Award;
              if (item.id === "video-editing") IconComp = Zap;
              if (item.id === "web-design") IconComp = Briefcase;
              if (item.id === "landing-page") IconComp = CheckCircle2;
              if (item.id === "social-media-growth") IconComp = TrendingUp;

              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.slug)}
                  className="bg-dark-card border border-gray-800 hover:border-brand/40 hover:scale-[1.02] p-6 rounded-sm transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors" />

                  <div className="space-y-6">
                    <div className="p-3 bg-brand/5 border border-brand/20 text-brand rounded-sm w-fit group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-white font-display font-bold text-base group-hover:text-brand transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-brand font-mono font-bold pt-6 tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>Explore Hub</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE US - BENTO GRID FEATURE */}
      <section className="bg-black py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Strict Philosophy</span>
            <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase mt-1">
              Engineered For Dominance
            </h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed font-light">
              We marry premium aesthetic interfaces with hyper-analytics performance to accelerate qualified conversions for SaaS founders and creators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {whyChooseUsStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-dark-card border border-gray-800 p-8 rounded-sm relative overflow-hidden group hover:border-brand/40 transition-colors"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-brand/5 group-hover:bg-brand transition-colors" />
                  <div className="p-4 bg-brand/5 border border-brand/20 text-brand rounded-sm w-fit mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-display font-bold text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. CLINICAL TIMELINE PROCESS */}
      <section className="bg-dark-bg py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-2">
              <span className="text-brand font-mono text-xs tracking-widest uppercase block font-semibold">Workflow Steps</span>
              <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase">
                The Product Timeline
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed font-light">
              Four steps separating initial alignment workshops from enterprise visual assets scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gray-800 z-0" />

            {processSteps.map((step, idx) => (
              <div key={idx} className="space-y-4 relative z-10">
                <div className="flex items-center justify-between sm:block">
                  <div className="w-12 h-12 rounded-sm bg-dark-card border-2 border-gray-800 flex items-center justify-center font-mono font-bold text-brand group-hover:border-brand">
                    {step.stage}
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 block mt-2 tracking-widest uppercase">
                    PHASE {idx + 1}
                  </span>
                </div>
                
                <h3 className="text-white font-display font-semibold text-base mt-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. LIVE STATS COUNTER */}
      <section className="bg-brand py-16 text-black font-display font-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          {statCounters.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-4xl md:text-6xl font-black font-sans leading-none tracking-tight">
                {stat.count}
              </div>
              <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-black/80 font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS SLIDER */}
      <section 
        className="bg-dark-bg py-24 border-t border-gray-800 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Credibility Proof</span>
              <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase mt-1">
                Endorsed by Fast Founders
              </h2>
              <p className="text-gray-400 text-xs tracking-normal max-w-xl">
                Bespoke design, development, and conversion transformations validated by fast-growing brands.
              </p>
            </div>

            {/* Slider control arrows */}
            <div className="flex items-center space-x-2.5 self-end md:self-auto">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-sm border border-gray-800 bg-black/60 hover:border-brand/50 hover:bg-brand/10 transition-all flex items-center justify-center text-gray-400 hover:text-brand focus:outline-none cursor-pointer"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-sm border border-gray-800 bg-black/60 hover:border-brand/50 hover:bg-brand/10 transition-all flex items-center justify-center text-gray-400 hover:text-brand focus:outline-none cursor-pointer"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Viewport */}
          <div className="overflow-visible -mx-3">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` 
              }}
            >
              {testimonials.map((test) => (
                <div 
                  key={test.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-3 flex"
                >
                  <div className="w-full bg-dark-card border border-gray-800 hover:border-brand/40 p-6 rounded-sm space-y-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
                    <div className="space-y-4">
                      {/* Rating Stars */}
                      <div className="flex items-center space-x-1">
                        {[...Array(test.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
                        ))}
                      </div>

                      <p className="text-gray-300 text-xs leading-relaxed font-light italic">
                        "{test.comment}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-800/40">
                      <img 
                        src={test.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"} 
                        alt={test.clientName} 
                        className="w-10 h-10 rounded-sm object-cover border border-brand/10 group-hover:border-brand/30 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-white text-xs font-bold font-display group-hover:text-brand transition-colors">
                          {test.clientName}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          {test.clientRole} • {test.company}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* step status bar indicators */}
          {testimonials.length > visibleCount && (
            <div className="flex justify-center items-center space-x-1.5 mt-10">
              {[...Array(testimonials.length - visibleCount + 1)].map((_, stepIdx) => (
                <button
                  key={stepIdx}
                  onClick={() => setCurrentIndex(stepIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                    currentIndex === stepIdx ? "w-8 bg-brand" : "w-2 bg-gray-800 hover:bg-gray-600"
                  }`}
                  aria-label={`Show testimonial page ${stepIdx + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 7. FEATURED CASE STUDIES / PORTFOLIO PREVIEW */}
      <section className="bg-black py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-2">
              <span className="text-brand font-mono text-xs tracking-widest uppercase block font-semibold">Case Portfolios</span>
              <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase">
                Featured Case Studies
              </h2>
            </div>
            
            <button
              onClick={() => onNavigate("graphic-design")}
              className="text-xs font-mono font-bold text-brand hover:underline flex items-center space-x-1.5 focus:outline-none"
            >
              <span>Explore All Historical Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {portfolio.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="bg-dark-card border border-gray-800 hover:border-brand/50 rounded-sm overflow-hidden group transition-all"
              >
                <div className="h-44 bg-zinc-900 overflow-hidden relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-1">
                  <span className="text-[9px] font-mono font-semibold uppercase text-brand">ACTIVE CAMPAIGN SUCCESS</span>
                  <h3 className="text-white font-display font-bold text-sm truncate">{item.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 pt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. PRICING PREVIEW */}
      <section className="bg-dark-bg py-24 border-t border-gray-800" id="app-pricing-preview-segment">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Tier Packages</span>
            <h2 className="text-4xl font-extrabold font-display tracking-tighter text-white uppercase mt-1">
              Transparent Dynamic Rates
            </h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Every deliverable satisfies the core spec parameters. All details are synchronized live with database records. See comprehensive options below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard preselected mock pricing for Graphic Design & video editing */}
            {packages.filter((_p, idx) => idx < 3).map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-dark-card border border-gray-800 hover:border-brand/40 rounded-sm p-8 relative flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest bg-brand/5 px-2 py-0.5 rounded-sm border border-brand/20">
                      LIVE DATABASE PACKAGE
                    </span>
                    <h3 className="text-white font-display font-black text-xl uppercase tracking-wider mt-4">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-3">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-1.5 py-4 border-y border-gray-800/40">
                    <span className="text-4xl font-sans font-black text-white">৳{pkg.price}</span>
                    <span className="text-xs text-gray-500 font-mono">/ customized brief</span>
                  </div>

                  <ul className="space-y-3 font-sans text-xs">
                    {pkg.features.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate("graphic-design")}
                  className="w-full mt-8 bg-white/5 hover:bg-brand text-white hover:text-black py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-all focus:outline-none"
                >
                  Configure & Place Order
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="bg-black py-24 border-t border-gray-800" id="app-faq-accordion">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">General Answers</span>
            <h2 className="text-3xl font-extrabold font-display tracking-tighter text-white uppercase mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i}
                  className="bg-dark-card border border-gray-800 rounded-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left p-6 flex items-center justify-between text-white font-display font-bold text-sm focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <Plus className={`w-5 h-5 text-brand shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="p-6 pt-0 text-xs leading-relaxed text-gray-400 border-t border-gray-800/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. NEWSLETTER & CONTACT CTA */}
      <section className="bg-[#050505] py-24 border-t border-gray-800 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tighter text-white uppercase">
              Ready to Accelerate Growth?
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Subscribe to our agency newsletter and receive custom conversion tips and exclusive package discount rates directly in your copy inbox.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {subSuccess ? (
              <div className="p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                ✓ Success! Subscription documented in agency records. Prepare for pristine tips!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="enter-your-email@corporate.com"
                  className="w-full bg-black border border-gray-800 focus:border-brand rounded-sm py-3.5 px-4 text-xs text-white focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-black py-3.5 px-8 rounded-sm font-black text-xs font-display tracking-widest uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-gray-800/50 max-w-lg mx-auto text-xs text-gray-400">
            Want to submit a custom workspace project brief immediately instead?{" "}
            <button
              onClick={() => onNavigate("contact")}
              className="text-brand font-bold hover:underline"
            >
              Contact Studio Now
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
