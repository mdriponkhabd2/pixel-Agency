import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, ChevronLeft, ChevronRight, Zap, Award, CheckCircle2, Star, Plus, 
  ShieldCheck, Compass, Briefcase, TrendingUp, Check, HelpCircle, Phone, ArrowLeft, 
  Send, Sparkles, Globe, Search, Palette, Film, Monitor, Layers, ShoppingCart, MessageSquare
} from "lucide-react";
import { Service, Testimonial, PortfolioItem, ServicePackage, WebsiteSettings, FAQ, User } from "../types";

interface MainLandingProps {
  services: Service[];
  testimonials: Testimonial[];
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  faqs: FAQ[];
  onNavigate: (route: string) => void;
  settings?: WebsiteSettings;
  activeServiceSlug?: string | null;
  currentUser?: User | null;
}

export default function MainLanding({
  services,
  testimonials,
  portfolio,
  packages,
  faqs,
  onNavigate,
  settings,
  activeServiceSlug,
  currentUser
}: MainLandingProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [emailSub, setEmailSub] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  // Services Hub Active state
  const [selectedServiceId, setSelectedServiceId] = useState("graphic-design");
  const servicesExplorerRef = useRef<HTMLDivElement>(null);

  // Service FAQ state
  const [activeServiceFaq, setActiveServiceFaq] = useState<string | null>(null);

  // Checkout Modal states
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  const [orderName, setOrderName] = useState(currentUser?.name || "");
  const [orderEmail, setOrderEmail] = useState(currentUser?.email || "");
  const [orderPhone, setOrderPhone] = useState(currentUser?.phone || "");
  const [projectDetails, setProjectDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  // Domain Lookup states (specific to domain-hosting service)
  const [domainName, setDomainName] = useState("");
  const [domainExt, setDomainExt] = useState(".com");
  const [domainSearching, setDomainSearching] = useState(false);
  const [domainResult, setDomainResult] = useState<{
    searched: string;
    available: boolean;
    price: string;
    suggestedAlternative?: string;
  } | null>(null);

  // Auto-sync tab select and smooth scroll when activeServiceSlug changes
  useEffect(() => {
    if (activeServiceSlug) {
      const match = services.find((s) => s.slug === activeServiceSlug);
      if (match) {
        setSelectedServiceId(match.id);
        setTimeout(() => {
          servicesExplorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, [activeServiceSlug, services]);

  // Sync auth details to checkout inputs when current user changes
  useEffect(() => {
    if (currentUser) {
      setOrderName(currentUser.name || "");
      setOrderEmail(currentUser.email || "");
      setOrderPhone(currentUser.phone || "");
    }
  }, [currentUser]);

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

  const handleOpenOrder = (pkg: ServicePackage) => {
    if (pkg.customOrderUrl) {
      window.open(pkg.customOrderUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedPkg(pkg);
    setOrderComplete(false);
    setErrorStatus("");
    setProjectDetails("");
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");
    setOrderComplete(false);

    if (!orderName || !orderEmail || !orderPhone) {
      setErrorStatus("Please input your name, email, and phone contact details.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: orderName,
          email: orderEmail,
          phone: orderPhone,
          serviceId: selectedServiceId,
          serviceName: services.find(s => s.id === selectedServiceId)?.name || selectedServiceId,
          packageId: selectedPkg?.id,
          packageName: selectedPkg?.name,
          price: selectedPkg?.price,
          projectDetails
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit order request.");
      }

      setOrderComplete(true);
    } catch (err: any) {
      setErrorStatus(err.message || "An unexpected error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppDirectLink = (pkg: ServicePackage) => {
    const activeSvc = services.find(s => s.id === selectedServiceId);
    const textMsg = `Hello Pixel Agency! I would like to order the ${pkg.name} for ${activeSvc?.name || "Services"} (৳${pkg.price}).\nMy Name: ${orderName || "Client"}\nPhone: ${orderPhone || "N/A"}\nDetails: ${projectDetails || "No special instructions"}`;
    return `https://wa.me/${settings?.whatsapp || "8801837679963"}?text=${encodeURIComponent(textMsg)}`;
  };

  const handleDomainCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    setDomainSearching(true);
    setDomainResult(null);

    let query = domainName.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    const dotIndex = query.indexOf(".");
    if (dotIndex !== -1) {
      query = query.substring(0, dotIndex);
    }
    const fullDomain = `${query}${domainExt}`;

    try {
      const response = await fetch(`/api/public/domain/check?domain=${encodeURIComponent(fullDomain)}`);
      const data = await response.json();
      
      const extPrices: Record<string, string> = {
        ".com": "1200",
        ".net": "1550",
        ".org": "1800",
        ".xyz": "250",
        ".co": "2750",
        ".tech": "400"
      };

      const selectedPrice = extPrices[domainExt] || "1200";

      setDomainResult({
        searched: data.searched || fullDomain,
        available: data.available !== false,
        price: selectedPrice,
        suggestedAlternative: data.available === false ? `${query}hq${domainExt}` : undefined
      });
    } catch (err) {
      console.error("DNS check failed, falling back:", err);
      const available = query.length >= 4 && !["google", "facebook", "apple", "microsoft", "amazon", "github", "pixel"].includes(query);
      const extPrices: Record<string, string> = {
        ".com": "1200",
        ".net": "1550",
        ".org": "1800",
        ".xyz": "250",
        ".co": "2750",
        ".tech": "400"
      };
      setDomainResult({
        searched: fullDomain,
        available,
        price: extPrices[domainExt] || "1200",
        suggestedAlternative: !available ? `${query}hq${domainExt}` : undefined
      });
    } finally {
      setDomainSearching(false);
    }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {services.map((item) => {
              // Get Icon by string mapping
              let IconComp = Compass;
              if (item.id === "graphic-design") IconComp = Palette;
              if (item.id === "video-editing") IconComp = Film;
              if (item.id === "web-design") IconComp = Monitor;
              if (item.id === "landing-page") IconComp = Layers;
              if (item.id === "social-media-growth") IconComp = TrendingUp;
              if (item.id === "domain-hosting") IconComp = Globe;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedServiceId(item.id);
                    setTimeout(() => {
                      servicesExplorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  className="bg-dark-card border border-gray-800 hover:border-brand/40 hover:scale-[1.02] p-5 rounded-sm transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors" />

                  <div className="space-y-4">
                    <div className="p-2.5 bg-brand/5 border border-brand/20 text-brand rounded-sm w-fit group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-white font-display font-bold text-sm tracking-tight group-hover:text-brand transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-2xs leading-relaxed line-clamp-3 font-normal">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-2xs text-brand font-mono font-bold pt-4 tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                    <span>Explore Hub</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BESPOKE SERVICES EXPLORER PORTAL */}
      <section 
        ref={servicesExplorerRef} 
        id="services-hub-portal-section" 
        className="bg-black py-24 border-t border-gray-800 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-brand/10 border border-brand/20 px-3.5 py-1.5 rounded-sm text-brand text-[10px] font-mono tracking-widest uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Interactive Services Portal</span>
            </div>
            <h2 className="text-4xl font-extrabold font-display tracking-tight text-white uppercase leading-none">
              Bespoke Services Hub
            </h2>
            <p className="text-xs text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
              Explore dynamic package configurations, live domain searches, targeted case studies, and specialized FAQ directories for each creative discipline.
            </p>
          </div>

          {/* 1. HORIZONTAL SCROLLABLE TABS */}
          <div className="flex overflow-x-auto pb-4 gap-3 justify-start lg:justify-center scrollbar-none scroll-smooth">
            {services.map((svc) => {
              const isActive = selectedServiceId === svc.id;
              let TabIcon = Compass;
              if (svc.id === "graphic-design") TabIcon = Palette;
              if (svc.id === "video-editing") TabIcon = Film;
              if (svc.id === "web-design") TabIcon = Monitor;
              if (svc.id === "landing-page") TabIcon = Layers;
              if (svc.id === "social-media-growth") TabIcon = TrendingUp;
              if (svc.id === "domain-hosting") TabIcon = Globe;

              return (
                <button
                  key={svc.id}
                  onClick={() => {
                    setSelectedServiceId(svc.id);
                    setDomainResult(null);
                    setDomainName("");
                    setActiveServiceFaq(null);
                  }}
                  className={`flex items-center space-x-2.5 px-6 py-4 border shrink-0 transition-all font-display rounded-sm uppercase tracking-wider text-2xs font-bold select-none cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-brand/10 border-brand text-brand shadow-[0_0_15px_rgba(255,107,0,0.05)]"
                      : "bg-dark-card border-gray-800 text-gray-400 hover:text-white hover:border-gray-750"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? "text-brand" : "text-gray-500"}`} />
                  <span>{svc.name}</span>
                </button>
              );
            })}
          </div>

          {/* 2. TAB CONTENT PORTAL */}
          {(() => {
            const activeSvc = services.find((s) => s.id === selectedServiceId) || services[0];
            if (!activeSvc) return null;

            const svcPackages = packages.filter((p) => p.serviceId === activeSvc.id && p.enabled);
            const svcPortfolio = portfolio.filter((p) => p.serviceId === activeSvc.id);
            const svcFaqs = faqs.filter((f) => f.serviceId === activeSvc.id);

            return (
              <div className="mt-12 space-y-16 animate-fade-in" key={activeSvc.id}>
                {/* A. Hero Banner of Active Service */}
                <div className="relative h-64 md:h-80 bg-zinc-950 border border-gray-850 rounded-sm overflow-hidden flex items-center p-8 md:p-12">
                  <div className="absolute inset-0">
                    <img
                      src={activeSvc.bannerUrl}
                      alt={activeSvc.name}
                      className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                  </div>
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <span className="text-brand font-mono text-[10px] tracking-widest uppercase font-bold">ACTIVE DISCIPLINE</span>
                    <h3 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-white uppercase">{activeSvc.name}</h3>
                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">{activeSvc.description}</p>
                  </div>
                </div>

                {/* B. Live Domain Checker (Rendered only on Domain & Hosting tab) */}
                {activeSvc.slug === "domain-hosting" && (
                  <div className="bg-dark-card border border-gray-800 p-8 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-brand" />
                    <span className="text-brand font-mono text-xs tracking-widest uppercase block font-bold mb-2">Live Domain Lookup Registry</span>
                    <h4 className="text-white font-display font-black uppercase tracking-wider text-xl mb-4">SECURE YOUR ELITE WORLD-WIDE ADDRESS</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 font-normal">
                      Check instant availability across global DNS nodes. Pick your premium top-level domain and bind it seamlessly to our high-performance cloud hosting stack in seconds.
                    </p>

                    <form onSubmit={handleDomainCheck} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-grow flex bg-black/60 border border-gray-850 focus-within:border-brand transition-colors rounded-sm overflow-hidden">
                        <div className="flex items-center pl-3 text-gray-500">
                          <Globe className="w-4 h-4 text-brand" />
                        </div>
                        <input
                          type="text"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          placeholder="e.g. yourbrandname"
                          className="w-full bg-transparent py-3.5 px-3 text-sm text-white font-mono focus:outline-none placeholder-gray-650 focus:ring-0"
                        />
                      </div>

                      <div className="flex sm:w-48 bg-black/60 border border-gray-850 rounded-sm overflow-hidden">
                        <select
                          value={domainExt}
                          onChange={(e) => setDomainExt(e.target.value)}
                          className="w-full bg-transparent py-3 px-3 text-sm text-white focus:outline-none font-mono cursor-pointer bg-neutral-950"
                        >
                          <option value=".com">.com (৳1,200/yr)</option>
                          <option value=".net">.net (৳1,550/yr)</option>
                          <option value=".org">.org (৳1,800/yr)</option>
                          <option value=".xyz">.xyz (৳250/yr)</option>
                          <option value=".co">.co (৳2,750/yr)</option>
                          <option value=".tech">.tech (৳400/yr)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={domainSearching}
                        className="bg-brand hover:bg-brand-hover text-black py-4 px-8 rounded-sm text-xs font-black tracking-widest uppercase transition-colors shrink-0 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {domainSearching ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>SEARCHING...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>CHECK DOMAIN</span>
                          </>
                        )}
                      </button>
                    </form>

                    {domainResult && (
                      <div className="mt-6 border-t border-gray-850 pt-6 animate-fade-in">
                        {domainResult.available ? (
                          <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 text-white rounded-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono text-sm uppercase">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                  <span>✓ {domainResult.searched} is fully available!</span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1.5 font-sans">
                                  Premium DNS routing verified. Secure this identity and link it directly to a hosting packages tier for only <span className="text-brand font-bold font-mono">৳{domainResult.price}/year</span>!
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const starterPkg = packages.find(p => p.id === "host-starter") || packages[0];
                                    if (starterPkg) {
                                      handleOpenOrder(starterPkg);
                                      setProjectDetails(`Requesting premium domain registration for: ${domainResult.searched}\nPlease link it directly with the plan (${starterPkg.name} - ৳${starterPkg.price}).`);
                                    } else {
                                      handleOpenOrder({
                                        id: "custom-domain-purchase",
                                        serviceId: activeSvc.id,
                                        name: `Domain Purchase: ${domainResult.searched}`,
                                        price: parseFloat(domainResult.price),
                                        description: "Global Domain Registration and Registry Lock Service",
                                        features: ["Instant Global DNS Integration", "Safe DNSSEC Shield Protection"],
                                        enabled: true
                                      });
                                      setProjectDetails(`Procure Domain registration for: ${domainResult.searched}`);
                                    }
                                  }}
                                  className="py-2.5 px-5 bg-brand hover:bg-brand-hover text-black text-2xs font-extrabold uppercase font-mono tracking-widest rounded-sm transition-colors cursor-pointer"
                                >
                                  ORDER & LINK PLAN
                                </button>
                                <a
                                  href={`${settings?.domainRegistrationUrl || "https://host.amarshebahost.com/cart.php?a=add&domain=register&query="}${encodeURIComponent(domainResult.searched)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-2.5 px-5 bg-black hover:bg-zinc-900 border border-brand/40 text-brand hover:text-white text-2xs font-extrabold uppercase font-mono tracking-widest rounded-sm transition-colors text-center inline-flex items-center space-x-1"
                                >
                                  <span>SECURE ON AMARSHEBAHOST ↗</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 bg-red-500/10 border border-red-500/20 text-white rounded-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center space-x-2 text-red-500 font-bold font-mono text-sm uppercase">
                                  <span className="w-2 h-2 rounded-full bg-red-500" />
                                  <span>✗ {domainResult.searched} is already registered</span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1.5 font-sans">
                                  This specific address is taken. Try another name, or lookup details on the official registrar.
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {domainResult.suggestedAlternative && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDomainName(domainResult.suggestedAlternative?.split(".")[0] || "");
                                      setDomainResult(null);
                                    }}
                                    className="py-2 px-3 bg-zinc-950 hover:bg-zinc-900 text-brand text-[10px] font-mono rounded-sm border border-gray-850 tracking-wider"
                                  >
                                    Suggestion: <span className="underline font-bold text-white">{domainResult.suggestedAlternative}</span>
                                  </button>
                                )}
                                <a
                                  href={`${settings?.domainRegistrationUrl || "https://host.amarshebahost.com/cart.php?a=add&domain=register&query="}${encodeURIComponent(domainResult.searched)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-rose-400 text-[10px] font-mono tracking-wider text-center rounded-sm"
                                >
                                  REGISTER PORTAL ↗
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* C. Packages Grid */}
                <div>
                  <div className="mb-10 text-center md:text-left">
                    <span className="text-brand font-mono text-[10px] tracking-widest uppercase font-bold">COMPETITIVE INVESTMENT PLANS</span>
                    <h4 className="text-white font-sans font-black text-2xl uppercase mt-1">SLA-Optimized Package Rates</h4>
                  </div>

                  {svcPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                      {svcPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="bg-dark-card border border-gray-850 hover:border-brand/30 rounded-sm p-8 flex flex-col justify-between transition-all relative group overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
                          <div className="space-y-6">
                            <div>
                              <span className="text-brand font-mono text-[10px] tracking-widest uppercase block font-bold mb-1">
                                {pkg.name === "Basic" ? "FOUNDATION" : pkg.name === "Standard" ? "POPULAR BUSINESS" : "ENTERPRISE PRO"}
                              </span>
                              <h5 className="text-white font-display font-black uppercase text-xl">{pkg.name}</h5>
                              <p className="text-gray-400 text-2xs mt-2 leading-relaxed min-h-[40px] font-normal">{pkg.description}</p>
                            </div>

                            <div className="flex items-baseline space-x-1 border-y border-gray-850 py-4">
                              <span className="text-brand font-mono text-lg font-bold">৳</span>
                              <span className="text-white text-3xl font-display font-black tracking-tight">{pkg.price.toLocaleString("en-US")}</span>
                              <span className="text-gray-500 font-mono text-2xs ml-1">/ project</span>
                            </div>

                            <ul className="space-y-3">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-2xs text-gray-300 font-normal">
                                  <Check className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-8">
                            <button
                              onClick={() => handleOpenOrder(pkg)}
                              className="w-full bg-brand hover:bg-brand-hover text-black py-3 px-6 rounded-sm text-2xs font-extrabold uppercase font-mono tracking-widest transition-all cursor-pointer text-center block"
                            >
                              CHOOSE & COMMISSION
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-dark-card border border-gray-850 rounded-sm space-y-4">
                      <HelpCircle className="w-10 h-10 text-brand mx-auto opacity-40 animate-pulse" />
                      <p className="text-xs text-gray-400">Customized SLAs and project-based structures are available for this discipline.</p>
                      <button
                        onClick={() => window.open(`https://wa.me/${settings?.whatsapp || "8801837679963"}?text=Hi Pixel Agency, I want to request a custom quote!`, "_blank")}
                        className="inline-flex items-center space-x-2 bg-brand text-black py-3 px-6 rounded-sm text-2xs font-bold uppercase tracking-wider font-mono"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>CONSULT VIA WHATSAPP</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* D. Portfolio Slider */}
                {svcPortfolio.length > 0 && (
                  <div>
                    <div className="mb-10 text-center md:text-left">
                      <span className="text-brand font-mono text-[10px] tracking-widest uppercase font-bold">CASE STUDIES & PROOFS</span>
                      <h4 className="text-white font-sans font-black text-2xl uppercase mt-1">Recent Masterpieces</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {svcPortfolio.map((port) => (
                        <div key={port.id} className="bg-dark-card border border-gray-850 rounded-sm overflow-hidden group hover:border-brand/20 transition-all">
                          <div className="relative h-48 md:h-52 overflow-hidden bg-black">
                            <img
                              src={port.imageUrl}
                              alt={port.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60" />
                          </div>
                          <div className="p-5 space-y-2">
                            <h5 className="text-white font-display font-bold text-sm tracking-tight">{port.title}</h5>
                            <p className="text-gray-400 text-2xs leading-relaxed font-normal">{port.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* E. Specialized FAQ Index */}
                {svcFaqs.length > 0 && (
                  <div className="bg-dark-card border border-gray-850 rounded-sm p-8">
                    <div className="mb-8">
                      <span className="text-brand font-mono text-[10px] tracking-widest uppercase font-bold">FAQ REGISTER</span>
                      <h4 className="text-white font-sans font-black text-xl uppercase mt-1">Discipline Specific FAQs</h4>
                    </div>

                    <div className="space-y-4">
                      {svcFaqs.map((faq) => {
                        const isExpanded = activeServiceFaq === faq.id;
                        return (
                          <div key={faq.id} className="border-b border-gray-850 pb-4">
                            <button
                              onClick={() => setActiveServiceFaq(isExpanded ? null : faq.id)}
                              className="w-full flex items-center justify-between text-left py-2 font-display text-xs text-white font-semibold hover:text-brand transition-colors focus:outline-none"
                            >
                              <span>{faq.question}</span>
                              <Plus className={`w-4 h-4 text-brand transform transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`} />
                            </button>
                            {isExpanded && (
                              <p className="text-2xs text-gray-400 mt-2 leading-relaxed pl-1 font-normal animate-fade-in">
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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

      {/* 11. CHECKOUT / BOOKING MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-gray-800 w-full max-w-lg p-6 md:p-8 rounded-sm relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedPkg(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>

            {!orderComplete ? (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div>
                  <span className="text-brand font-mono text-[10px] tracking-widest uppercase font-bold">SECURE SERVICE DELEGATION</span>
                  <h4 className="text-white font-sans font-black text-xl uppercase mt-1">COMMISSION AN ORDER</h4>
                  <p className="text-2xs text-gray-400 mt-1 font-normal">
                    You are subscribing to the <span className="text-brand font-bold">{selectedPkg.name}</span> for your active brand project.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-gray-850 rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-2xs block">Selected Tier Plan</span>
                    <span className="text-white font-display font-extrabold text-sm uppercase">{selectedPkg.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-2xs block">Guaranteed Rate</span>
                    <span className="text-brand font-mono font-bold text-sm">৳{selectedPkg.price.toLocaleString("en-US")}</span>
                  </div>
                </div>

                {errorStatus && (
                  <p className="p-3 bg-red-500/10 border border-red-500/20 text-rose-400 text-xs font-mono rounded-sm">
                    {errorStatus}
                  </p>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      placeholder="e.g. Shakib Al Hasan"
                      className="w-full bg-black/60 border border-gray-850 focus:border-brand transition-colors text-xs py-3 px-3.5 text-white focus:outline-none rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Email Address</label>
                      <input
                        type="email"
                        required
                        value={orderEmail}
                        onChange={(e) => setOrderEmail(e.target.value)}
                        placeholder="e.g. shakib@brand.com"
                        className="w-full bg-black/60 border border-gray-850 focus:border-brand transition-colors text-xs py-3 px-3.5 text-white focus:outline-none rounded-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Phone Contact Number</label>
                      <input
                        type="tel"
                        required
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="e.g. 01837679963"
                        className="w-full bg-black/60 border border-gray-850 focus:border-brand transition-colors text-xs py-3 px-3.5 text-white focus:outline-none rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block font-semibold">Project Requirements & Brief Details</label>
                    <textarea
                      required
                      rows={3}
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="e.g. I need a cohesive modern tech-focused minimalist visual identity with typography guidelines and assets."
                      className="w-full bg-black/60 border border-gray-850 focus:border-brand transition-colors text-xs py-3 px-3.5 text-white focus:outline-none rounded-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white/10 hover:bg-white/15 text-white py-3.5 px-4 rounded-sm text-2xs font-bold uppercase font-mono tracking-widest border border-gray-800 transition-colors cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>SUBMITTING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SECURE SUBMIT</span>
                      </>
                    )}
                  </button>

                  <a
                    href={generateWhatsAppDirectLink(selectedPkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-brand hover:bg-brand-hover text-black py-3.5 px-4 rounded-sm text-2xs font-black uppercase font-mono tracking-widest transition-colors inline-flex items-center justify-center space-x-2 text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>VIA WHATSAPP</span>
                  </a>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-sans font-black text-xl uppercase">Order Request Transmitted</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Your agency brief has been securely catalogued. Our creative team will initiate a priority chat outreach with you within the next 2-4 hours.
                  </p>
                </div>
                <div className="pt-4 flex flex-col gap-2">
                  <a
                    href={generateWhatsAppDirectLink(selectedPkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-brand hover:bg-brand-hover text-black py-3.5 px-4 rounded-sm text-2xs font-black uppercase font-mono tracking-widest transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>INSTANT WHATSAPP SLA CHAT</span>
                  </a>
                  <button
                    onClick={() => {
                      setSelectedPkg(null);
                      setOrderComplete(false);
                    }}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white py-3.5 px-4 rounded-sm text-2xs font-bold uppercase font-mono tracking-widest transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
