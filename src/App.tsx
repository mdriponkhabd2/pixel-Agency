import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import MainLanding from "./components/MainLanding";
import ServicePage from "./components/ServicePage";
import AuthPages from "./components/AuthPages";
import AdminPanel from "./components/AdminPanel";
import ContactForm from "./components/ContactForm";

import { Service, ServicePackage, PortfolioItem, Testimonial, FAQ, Order, User, WebsiteSettings, ContactMessage } from "./types";

export default function App() {
  // Navigation Route state
  const [currentRoute, setCurrentRoute] = useState("home");

  // Authentication Context state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data models loaded dynamically from server
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    address: "Jamtoli, Austagram, Kishoreganj-2380",
    whatsapp: "01837679963",
    liveChatEnabled: true,
    seoTitle: "Pixel Agency - Elite Digital Services",
    seoKeywords: "design, editing, dev",
    seoDescription: "World-class digital assets."
  });

  // Admin exclusive states
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Startup loaders
  const [appLoading, setAppLoading] = useState(true);

  // URL Hash Synchronizer
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || "home";
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Trigger on initial layout

    // Recover logged-in session securely if preserved in localStorage
    const savedUser = localStorage.getItem("agency_session_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("agency_session_user");
      }
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Primary data synchronized from server API on state change or boot
  const loadPublicData = async () => {
    try {
      const resp = await fetch("/api/public/data");
      if (!resp.ok) throw new Error("Public data offline");
      const data = await resp.json();
      
      setServices(data.services || []);
      setPackages(data.packages || []);
      setPortfolio(data.portfolio || []);
      setTestimonials(data.testimonials || []);
      setFaqs(data.faqs || []);
      setSettings(data.settings || settings);
    } catch (err) {
      console.warn("Express server initial bootstrap pending, loading design mock variables.");
    } finally {
      setAppLoading(false);
    }
  };

  // Additional data fetched exclusively when Admin session is certified
  const loadAdminAllData = async () => {
    if (!currentUser || currentUser.role !== "admin") return;
    try {
      const resp = await fetch("/api/admin/all-data");
      if (!resp.ok) throw new Error("Admin query exception");
      const data = await resp.json();

      setUsers(data.users || []);
      setServices(data.services || []);
      setPackages(data.packages || []);
      setPortfolio(data.portfolio || []);
      setTestimonials(data.testimonials || []);
      setFaqs(data.faqs || []);
      setOrders(data.orders || []);
      setContacts(data.contacts || []);
      setSettings(data.settings || settings);
    } catch (err) {
      console.error("Failed to sync deep admin panel models:", err);
    }
  };

  // Trigger reload on boot or role verification
  useEffect(() => {
    loadPublicData();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadAdminAllData();
    }
  }, [currentUser]);

  const handleNavigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("agency_session_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("agency_session_user");
    handleNavigate("home");
  };

  const syncAdminChanges = () => {
    loadPublicData();
    loadAdminAllData();
  };

  if (appLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black font-display text-gray-400">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-brand font-bold animate-pulse">
          Pixel Agency • Core Hydration...
        </span>
      </div>
    );
  }

  // Determine which service page structure to load if slug matches services list
  const activeService = services.find((s) => s.slug === currentRoute);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans antialiased select-none scrollbar-none selection:bg-brand selection:text-black">
      
      {/* 1. Global Translucent Header */}
      <Navbar
        services={services}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        settings={settings}
      />

      {/* 2. Primary Layout switch viewport */}
      <main className="flex-grow">
        
        {/* Dynamic Route: Home Overview */}
        {currentRoute === "home" && (
          <MainLanding
            services={services}
            testimonials={testimonials}
            portfolio={portfolio}
            packages={packages}
            onNavigate={handleNavigate}
            settings={settings}
          />
        )}

        {/* Dynamic Route: Standard Pricing list */}
        {currentRoute === "pricing" && (
          <div className="pt-28 pb-16">
            <MainLanding
              services={services}
              testimonials={testimonials}
              portfolio={portfolio}
              packages={packages}
              onNavigate={handleNavigate}
              settings={settings}
            />
          </div>
        )}

        {/* Dynamic Route: About Page segment */}
        {currentRoute === "about" && (
          <div className="max-w-7xl mx-auto px-6 py-32 font-sans space-y-16" id="about-us-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-brand font-mono text-xs tracking-widest uppercase block font-semibold">Our Identity Booklet</span>
                <h1 className="text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
                  {settings.aboutTitle || "THE DIGITAL ARCHITECT CREW"}
                </h1>
                <div className="w-16 h-1 bg-brand mt-4" />
                <p className="text-gray-300 text-sm leading-relaxed mt-4">
                  {settings.aboutContent || "Founded initially as a micro visual group in Jamtoli, Austagram, Kishoreganj, Pixel Agency has transformed into an international digital agency. We align conversions, premium design parameters, and ultra-high speed software systems under a single design language. We completely reject low value template builders in favor of bespoke visual architectures."}
                </p>
              </div>

              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-2 rounded-sm border border-brand/20 bg-brand/5 -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative h-96 bg-zinc-900 border border-gray-800 rounded-sm overflow-hidden shadow-2xl">
                  <img 
                    src={settings.aboutImageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"} 
                    alt="About Us Feature Visual" 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-6">
              <div className="bg-dark-card border border-dark-border p-8 rounded-2xl space-y-4 leading-relaxed relative">
                <div className="absolute top-0 left-0 w-1 h-12 bg-brand" />
                <h3 className="text-white font-display font-bold text-base uppercase">Premium Engineering Core</h3>
                <p className="text-xs text-gray-400">
                  Every asset we render (whether vectors, 4k cinematically synced short-forms, or clean React software pipelines) maps directly back to custom Conversion Psychology blueprints. We optimize typography contrast layouts to guarantee zero visual friction.
                </p>
              </div>

              <div className="bg-dark-card border border-dark-border p-8 rounded-2xl space-y-4 leading-relaxed relative">
                <div className="absolute top-0 left-0 w-1 h-12 bg-brand" />
                <h3 className="text-white font-display font-bold text-base uppercase">Client Support SLA Guaranteed</h3>
                <p className="text-xs text-gray-400">
                  Our crew manages work files live from 08:00 to 22:00 in multiple regions, backed by our around-the-clock priority WhatsApp chatbot dispatcher and dedicated project support, which are standard for all enterprise partners.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8 max-w-sm mx-auto">
              <button
                onClick={() => handleNavigate("contact")}
                className="w-full bg-brand text-black py-3.5 px-8 rounded-xl font-bold font-display tracking-wider uppercase text-xs focus:outline-none"
              >
                Connect With the Crew
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Route: Contact Section */}
        {currentRoute === "contact" && (
          <div className="pt-20">
            <ContactForm address={settings.address} whatsapp={settings.whatsapp} />
          </div>
        )}

        {/* Dynamic Service slugs route catcher */}
        {activeService && (
          <div className="pt-16">
            <ServicePage
              service={activeService}
              packages={packages.filter((p) => p.serviceId === activeService.id)}
              portfolio={portfolio.filter((p) => p.serviceId === activeService.id)}
              faqs={faqs.filter((f) => f.serviceId === activeService.id || !f.serviceId)}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              settings={settings}
            />
          </div>
        )}

        {/* Security Signin / Signup viewport */}
        {(currentRoute === "login" || currentRoute === "signup" || currentRoute === "admin-login") && (
          <div className="pt-12">
            <AuthPages
              initialMode={currentRoute as any}
              onAuthSuccess={handleAuthSuccess}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Dynamic Route: Authorized Admin Panel View */}
        {currentRoute === "admin" && (
          currentUser && currentUser.role === "admin" ? (
            <AdminPanel
              services={services}
              packages={packages}
              portfolio={portfolio}
              testimonials={testimonials}
              faqs={faqs}
              orders={orders}
              contacts={contacts}
              users={users}
              settings={settings}
              onRefreshData={syncAdminChanges}
              onNavigate={handleNavigate}
            />
          ) : (
            <div className="pt-12">
              <AuthPages
                initialMode="admin-login"
                onAuthSuccess={handleAuthSuccess}
                onNavigate={handleNavigate}
              />
            </div>
          )
        )}

        {/* Static Content Routes */}
        {currentRoute === "privacy" && (
          <div className="max-w-4xl mx-auto px-6 py-36 font-sans space-y-8" id="privacy-co-policy">
            <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider">Privacy Policy</h1>
            <p className="text-xs text-gray-400 leading-relaxed font-mono">Last modified: June 9, 2026</p>
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-xs leading-relaxed text-gray-300 space-y-4">
              <p>At Pixel Agency, operational visual transparency is our master guideline. We collect customer names, phone inputs, email addresses, and brief documents strictly to construct personalized, optimized project assets.</p>
              <h3 className="text-white font-display font-bold uppercase mt-4">Data Security & Storage</h3>
              <p>All private deliverables logs and databases submitted from checkout grids are isolated. We never sell your personal information or metadata coordinates to third-party ad brokers.</p>
            </div>
          </div>
        )}

        {currentRoute === "terms" && (
          <div className="max-w-4xl mx-auto px-6 py-36 font-sans space-y-8" id="terms-co-policy">
            <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider">Terms & Conditions</h1>
            <p className="text-xs text-gray-400 leading-relaxed font-mono">Last modified: June 9, 2026</p>
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-xs leading-relaxed text-gray-300 space-y-4">
              <p>By registering credentials or booking dynamic packages, clients agree to cooperate with designated Visual Directors. Timelines begin post-brief synchronization workshops.</p>
              <h3 className="text-white font-display font-bold uppercase mt-4">Database & Content License</h3>
              <p>All delivered graphic vectors, cinema footage files and software repositories become the exclusive property of the commissioning client upon 100% financial settlement.</p>
            </div>
          </div>
        )}

        {currentRoute === "refund" && (
          <div className="max-w-4xl mx-auto px-6 py-36 font-sans space-y-8" id="refund-co-policy">
            <h1 className="text-3xl font-bold text-white font-display uppercase tracking-wider">Refund Policy</h1>
            <p className="text-[10px] text-gray-400 leading-relaxed font-mono">Last modified: June 9, 2026</p>
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-xs leading-relaxed text-gray-300 space-y-4">
              <p>We pride ourselves on 100% customer satisfaction parameters. Clients are entitled to invoke full revision cycles on vectors and film timelines during production phases.</p>
              <h3 className="text-white font-display font-bold uppercase mt-4">Pristine Settlement Guarantee</h3>
              <p>If we fail to deliver assets mapping to brief specifications under visual agreements, clients receive up to 100% reimbursement, subject to manager audits.</p>
            </div>
          </div>
        )}

      </main>

      {/* 3. Global Translucent Footer */}
      <Footer
        services={services}
        onNavigate={handleNavigate}
        address={settings.address}
        whatsapp={settings.whatsapp}
      />

      {/* 4. Floating Animated WhatsApp chat button */}
      <WhatsAppButton />

    </div>
  );
}
