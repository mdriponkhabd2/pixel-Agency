import React, { useState } from "react";
import { Check, Star, ShoppingCart, HelpCircle, Phone, ArrowLeft, Send, Sparkles, MessageCircleCode, Globe, Search } from "lucide-react";
import { Service, ServicePackage, PortfolioItem, FAQ, User, WebsiteSettings } from "../types";

interface ServicePageProps {
  service: Service;
  packages: ServicePackage[];
  portfolio: PortfolioItem[];
  faqs: FAQ[];
  currentUser: User | null;
  onNavigate: (route: string) => void;
  settings?: WebsiteSettings;
}

export default function ServicePage({
  service,
  packages,
  portfolio,
  faqs,
  currentUser,
  onNavigate,
  settings
}: ServicePageProps) {
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  
  // Custom interactive Domain search states
  const [domainName, setDomainName] = useState("");
  const [domainExt, setDomainExt] = useState(".com");
  const [domainSearching, setDomainSearching] = useState(false);
  const [domainResult, setDomainResult] = useState<{
    searched: string;
    available: boolean;
    price: string;
    suggestedAlternative?: string;
  } | null>(null);
  
  // Order form state variables
  const [orderName, setOrderName] = useState(currentUser?.name || "");
  const [orderEmail, setOrderEmail] = useState(currentUser?.email || "");
  const [orderPhone, setOrderPhone] = useState(currentUser?.phone || "");
  const [projectDetails, setProjectDetails] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const handleOpenOrder = (pkg: ServicePackage) => {
    if (pkg.customOrderUrl) {
      window.open(pkg.customOrderUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedPkg(pkg);
    // Autofill user details securely if logged in
    setOrderName(currentUser?.name || "");
    setOrderEmail(currentUser?.email || "");
    setOrderPhone(currentUser?.phone || "");
    setProjectDetails("");
    setOrderComplete(false);
    setErrorStatus("");
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
          serviceId: service.id,
          serviceName: service.name,
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

  const handleDomainCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    setDomainSearching(true);
    setDomainResult(null);

    // Clean up query
    let query = domainName.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
    // Remove existing TLD if user typed one
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

  const generateWhatsAppDirectLink = (pkg: ServicePackage) => {
    const textMsg = `Hello Pixel Agency! I would like to order the ${pkg.name} for ${service.name} (৳${pkg.price}).\nMy Name: ${orderName || "Client"}\nPhone: ${orderPhone || "N/A"}\nDetails: ${projectDetails || "No special instructions"}`;
    return `https://wa.me/8801837679963?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <div className="font-sans text-gray-300 pb-20" id={`service-page-${service.id}`}>
      
      {/* 1. Header Banner */}
      <div 
        className="relative h-[45vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url('${service.bannerUrl}')` }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(255,107,0,0.1) 0%, transparent 80%)" />
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />

        <div className="relative text-center max-w-4xl px-6 animate-fade-in">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center space-x-1 text-xs font-mono text-brand mb-4 hover:underline focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Studio Feed</span>
          </button>
          
          <h1 className="text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tight">
            {service.name} <span className="text-brand">Hub</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-4 font-normal">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* 2. Main Narrative Overview or Domain Search Box */}
      {service.slug === "domain-hosting" ? (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div className="bg-dark-card border border-gray-800 hover:border-brand/30 rounded-sm p-8 md:p-10 relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-[4px] h-24 bg-brand" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
            
            <span className="text-brand font-mono text-xs tracking-widest uppercase block font-semibold mb-2">Live Domain Lookup Registry</span>
            <h3 className="text-white font-display font-black uppercase tracking-wider text-xl mb-4">
              SECURE YOUR ELITE WORLD-WIDE ADDRESS
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Check instant availability across global DNS nodes. Pick your premium top-level domain and bind it seamlessly to our high-performance cloud hosting stack in seconds.
            </p>

            <form onSubmit={handleDomainCheck} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow flex bg-black/60 border border-gray-800 focus-within:border-brand transition-colors rounded-sm overflow-hidden">
                <div className="flex items-center pl-3 text-gray-500">
                  <Globe className="w-4 h-4 text-brand" />
                </div>
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="e.g. yourbrandname"
                  className="w-full bg-transparent py-3.5 px-3 text-sm text-white font-mono focus:outline-none placeholder-gray-600 focus:ring-0"
                />
              </div>

              <div className="flex sm:w-48 bg-black/60 border border-gray-800 rounded-sm overflow-hidden">
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

            {/* Simulated Domain Check Results */}
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
                              setProjectDetails(`Requesting premium domain registration for: ${domainResult.searched}\nPlease link it directly with the Starter Hosting plan (৳${starterPkg.price}/mo).`);
                            } else {
                              handleOpenOrder({
                                id: "custom-domain-purchase",
                                serviceId: service.id,
                                name: `Domain Purchase: ${domainResult.searched}`,
                                price: parseFloat(domainResult.price),
                                description: "Global Domain Registration and Registry Lock Service",
                                features: ["Instant Global DNS Integration", "Safe DNSSEC Shield Protection"],
                                enabled: true
                              });
                              setProjectDetails(`Procure Domain registration for: ${domainResult.searched}`);
                            }
                          }}
                          className="py-2.5 px-5 bg-brand hover:bg-brand-hover text-black text-2xs font-extrabold uppercase font-mono tracking-widest rounded-sm transition-colors text-center inline-block cursor-pointer focus:outline-none"
                        >
                          ORDER & LINK HOSTING
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
                            className="py-2 px-3 bg-zinc-950 hover:bg-zinc-900 text-brand text-[10px] font-mono rounded-sm border border-gray-800 tracking-wider text-center"
                          >
                            Suggestion: <span className="underline font-bold text-white">{domainResult.suggestedAlternative}</span>
                          </button>
                        )}

                        <a
                          href={`${settings?.domainRegistrationUrl || "https://host.amarshebahost.com/cart.php?a=add&domain=register&query="}${encodeURIComponent(domainResult.searched)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-rose-400 text-[10px] font-mono tracking-wider text-center rounded-sm inline-block"
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
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-dark-card border border-gray-800 rounded-sm p-8 md:p-10 relative">
            <div className="absolute top-0 left-0 w-[4px] h-16 bg-brand" />
            <h3 className="text-white font-display font-black uppercase tracking-wider text-sm mb-4 border-b border-gray-800 pb-3">
              Strategic Vision & Delivery
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-400">
              {service.description}
            </p>
          </div>
        </div>
      )}

      {/* 3. Pricing Plan & Packages (CENTERED & DYNAMIC IN THE MIDDLE) */}
      <div className="border-t border-gray-900 bg-black/40 py-20" id="service-pricing-tiers-section">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Value Tiers</span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white uppercase mt-2">
              CHOOSE YOUR WORK PLAN
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-3 leading-relaxed">
              Select a performance-guided tier designed to optimize your creative delivery and secure maximum conversions.
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="bg-dark-card border border-gray-800 rounded-sm p-12 text-center text-xs text-gray-500 font-mono max-w-xl mx-auto">
              No active plans loaded for this service yet. Explore custom configurations via our direct WhatsApp desk.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="bg-dark-card border border-gray-800 hover:border-brand/50 rounded-sm p-8 transition-all hover:scale-[1.01] flex flex-col justify-between group relative shadow-xl"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-800 group-hover:bg-brand transition-colors" />
                  
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-display font-black text-lg uppercase tracking-wide">
                          {pkg.name}
                        </h4>
                        <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-3">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-1.5 py-4 border-y border-gray-800/60">
                      <span className="text-3xl md:text-4xl font-sans font-black text-brand">৳{pkg.price}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {service.slug === "domain-hosting" ? "/ month" : "/ customized brief"}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 font-sans text-xs">
                      {pkg.features.map((feat, index) => (
                        <div key={index} className="flex items-start space-x-2.5">
                          <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <span className="leading-relaxed text-gray-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenOrder(pkg)}
                    className="w-full mt-8 bg-brand hover:bg-brand-hover text-black py-3 rounded-sm text-xs font-black uppercase tracking-widest transition-colors inline-flex items-center justify-center space-x-2 focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Select Package Tier</span>
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 4. Portfolio Showcase Segment (Centered Responsive Grid) */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Our Showcases</span>
          <h2 className="text-3xl font-extrabold font-display tracking-tight text-white uppercase mt-2">
            PORTFOLIO SHOWCASE
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Explore premium materials, high-speed custom interfaces, and luxury frameworks curated for your review.
          </p>
        </div>

        {portfolio.length === 0 ? (
          <div className="bg-dark-card border border-gray-800 rounded-sm p-12 text-center text-xs text-gray-500 font-mono max-w-xl mx-auto">
            No archived portfolio items registered for this service yet. Explore our dynamic global case studies.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item) => (
              <div 
                key={item.id} 
                className="bg-dark-card border border-gray-800 rounded-sm overflow-hidden group hover:border-brand transition-all duration-300"
              >
                <div className="h-52 bg-zinc-900 relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] uppercase font-bold text-black bg-brand px-2.5 py-1 rounded-sm">
                      Explore Concept
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="text-white font-display font-bold text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Service FAQ (Centered layout) */}
      <div className="bg-black/60 py-20 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-brand font-mono text-xs tracking-widest uppercase font-semibold">Service FAQ</span>
            <h2 className="text-3xl font-extrabold font-display tracking-tight text-white uppercase mt-2">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-dark-card border border-gray-800 rounded-sm p-6 relative">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold text-sm leading-relaxed">{faq.question}</h4>
                    <p className="text-gray-400 text-xs mt-2.5 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 6. Elegant Order Modal Drawer Overlay */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-dark-card border border-gray-800 rounded-sm overflow-hidden shadow-2xl relative glow-orange">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-brand" />
            
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-display font-black text-sm uppercase tracking-wider">
                  Complete Project Order
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: <span className="text-brand font-mono font-bold">{selectedPkg.name}</span> for {service.name} (${selectedPkg.price})
                </p>
              </div>
              
              <button
                onClick={() => setSelectedPkg(null)}
                className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-sm bg-black/40 border border-gray-800"
              >
                Close
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {orderComplete ? (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-sm bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-brand animate-spin" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-display font-bold text-lg uppercase">Order Saved Successfully!</h4>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                      Your brief is archived inside our dynamic agency database. Double down on immediate dispatch by sending an automated WhatsApp confirmation message. Outlining key specs accelerates speed!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a 
                      href={generateWhatsAppDirectLink(selectedPkg)}
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full sm:w-auto py-3 px-6 rounded-sm bg-[#00e676] hover:bg-[#00c853] text-black font-black text-xs font-display tracking-widest inline-flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4 text-black" />
                      <span>DISPATCH WHATSAPP ORDER</span>
                    </a>
                    
                    <button
                      onClick={() => setSelectedPkg(null)}
                      className="w-full sm:w-auto py-3 px-6 rounded-sm border border-gray-800 hover:bg-white/5 text-gray-300 font-bold text-xs"
                    >
                      Complete & Dismiss
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4" id="form-project-order-submission">
                  {errorStatus && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-sm">
                      ⚠ {errorStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1.5">
                        Client Name
                      </label>
                      <input
                        type="text"
                        required
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        placeholder="Marcus"
                        className="w-full bg-black/80 border border-gray-800 focus:border-brand rounded-sm py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1.5">
                        E-Mail Address
                      </label>
                      <input
                        type="email"
                        required
                        value={orderEmail}
                        onChange={(e) => setOrderEmail(e.target.value)}
                        placeholder="client@growth.com"
                        className="w-full bg-black/80 border border-gray-810 focus:border-brand rounded-sm py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1.5">
                      Phone Number / whatsapp
                    </label>
                    <input
                      type="text"
                      required
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      placeholder="e.g. 01837679963"
                      className="w-full bg-black/80 border border-gray-800 focus:border-brand rounded-sm py-2 px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1.5">
                      Brief & Asset specifications
                    </label>
                    <textarea
                      rows={4}
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Tell us about details: color scheme preferences, source assets, branding tone, timelines... This helps prepare optimized deliveries!"
                      className="w-full bg-black/80 border border-gray-800 focus:border-brand rounded-sm py-2 px-3 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-4">
                    <span className="text-[9px] text-gray-500 font-mono">
                      Stored in agency DB • Active tracking
                    </span>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-brand hover:bg-brand-hover text-black py-2.5 px-6 rounded-sm text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>{submitting ? "Booking Order..." : "PLACE ORDER NOW"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
