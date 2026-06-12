import { useState, useEffect } from "react";
import { Menu, X, LogIn, UserPlus, LogOut, LayoutDashboard, Compass, ChevronDown, ExternalLink } from "lucide-react";
import { Service, User, WebsiteSettings } from "../types";

interface NavbarProps {
  services: Service[];
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  settings?: WebsiteSettings;
}

export default function Navbar({ services, currentRoute, onNavigate, currentUser, onLogout, settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const domainHostingMenu = [
    { label: "BDIX Hosting", key: "bdixHostingUrl" },
    { label: "USA Hosting", key: "usaHostingUrl" },
    { label: "Singapur Hosting", key: "singaporeHostingUrl" },
    { label: "Garmany Hosting", key: "germanyHostingUrl" },
    { label: "BDIX Reseller Host", key: "bdixResellerUrl" },
    { label: "USA Reseller Host", key: "usaResellerUrl" },
    { label: "Singapur Reseller Host", key: "singaporeResellerUrl" },
    { label: "Garmany Reseller Host", key: "germanyResellerUrl" },
    { label: "Domain Pricing", key: "domainPricingUrl" },
    { label: "Domain Transfer", key: "domainTransferUrl" },
    { label: "Domain Dns Checker", key: "domainDnsCheckerUrl" }
  ];

  const navMenuItems = [
    { label: "Home", slug: "home" },
    { label: "About Us", slug: "about" },
    { label: "Contact Us", slug: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-display ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-dark-border py-4"
          : "bg-transparent py-6"
      }`}
      id="main-app-nav"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => handleLinkClick("home")}>
          {settings?.logoImageUrl ? (
            <img 
              src={settings.logoImageUrl} 
              alt="Logo" 
              className="h-8 max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <span className="w-8 h-8 rounded-sm bg-brand flex items-center justify-center font-bold text-black text-lg transition-transform duration-300 group-hover:rotate-6">
              P
            </span>
          )}
          <span className="text-xl font-bold tracking-tighter uppercase text-white">
            PIXEL<span className="text-brand transition-colors duration-300 group-hover:text-brand-hover"> AGENCY</span>
          </span>
        </div>

        {/* Desktop Primary Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <button
            onClick={() => handleLinkClick("home")}
            className={`text-sm font-medium tracking-wide transition-colors ${
              currentRoute === "home" ? "text-brand" : "text-gray-300 hover:text-brand"
            }`}
          >
            Home
          </button>

          {/* Dynamic Services dropdown menu */}
          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium tracking-wide text-gray-300 hover:text-brand transition-colors focus:outline-none">
              <span>Services</span>
              <Compass className="w-4 h-4 text-brand" />
            </button>
            
            {/* Elegant Dropdown hover block */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-dark-card border border-gray-800 rounded-sm p-3 shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="grid grid-cols-1 gap-1">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleLinkClick(svc.slug)}
                    className={`w-full text-left p-2.5 rounded-sm text-xs font-semibold tracking-wider hover:bg-brand/10 hover:text-brand transition-all flex items-center justify-between ${
                      currentRoute === svc.slug ? "bg-brand/5 text-brand" : "text-gray-300"
                    }`}
                  >
                    <span>{svc.name}</span>
                    <span className="w-1.5 h-1.5 rounded-none rotate-45 bg-brand opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Domain & Hosting Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium tracking-wide text-gray-300 hover:text-brand transition-colors focus:outline-none">
              <span>Domain & Hosting</span>
              <ChevronDown className="w-4 h-4 text-brand" />
            </button>
            
            {/* Elegant Dropdown hover block */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-dark-card border border-gray-800 rounded-sm p-3 shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-1">
                {domainHostingMenu.map((item) => {
                  const targetUrl = settings?.[item.key as keyof WebsiteSettings] as string || "https://host.amarshebahost.com";
                  return (
                    <a
                      key={item.key}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left p-2.5 rounded-sm text-xs font-semibold tracking-wider text-gray-300 hover:bg-brand/10 hover:text-brand transition-all flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Custom Menu Items */}
          {settings?.customMenuItems && settings.customMenuItems.length > 0 && settings.customMenuItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand transition-colors flex items-center space-x-1"
            >
              <span>{item.label}</span>
              {item.isExternal && <ExternalLink className="w-3.5 h-3.5 text-brand/80 opacity-70" />}
            </a>
          ))}

          {/* Core Static Pages */}
          {navMenuItems.slice(1).map((item) => (
            <button
              key={item.slug}
              onClick={() => handleLinkClick(item.slug)}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentRoute === item.slug ? "text-brand" : "text-gray-300 hover:text-brand"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Access CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              {currentUser.role === "admin" ? (
                <button
                  onClick={() => handleLinkClick("admin")}
                  className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all focus:outline-none"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-gray-400">
                  User: <span className="text-white font-semibold">{currentUser.name}</span>
                </span>
              )}
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-sm border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all focus:outline-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleLinkClick("login")}
                className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-sm border border-brand/20 hover:bg-brand/10 hover:border-brand text-white transition-all focus:outline-none"
              >
                <LogIn className="w-3.5 h-3.5 text-brand" />
                <span>Login</span>
              </button>
              <button
                onClick={() => handleLinkClick("signup")}
                className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-sm bg-brand hover:bg-brand-hover text-black transition-all focus:outline-none"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex items-center lg:hidden space-x-3">
          {currentUser && (
            <button
              onClick={() => handleLinkClick(currentUser.role === "admin" ? "admin" : "home")}
              className="p-2 rounded-sm bg-dark-card border border-gray-800 text-brand"
              aria-label="Direct to user workspace"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-sm bg-dark-card border border-gray-800 text-white hover:text-brand focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#000000] border-b border-gray-800 shadow-none p-6 space-y-6 animate-fade-in z-45">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleLinkClick("home")}
              className={`text-left text-base font-semibold tracking-wide py-2 ${
                currentRoute === "home" ? "text-brand" : "text-gray-300"
              }`}
            >
              Home Page
            </button>

            {/* Services inside mobile accordion */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Our Services Overview</span>
              <div className="grid grid-cols-1 gap-2 pl-2">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleLinkClick(svc.slug)}
                    className={`text-left text-sm py-1.5 ${
                      currentRoute === svc.slug ? "text-brand font-medium" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    ★ {svc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain & Hosting inside mobile drawer */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Domain & Hosting</span>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {domainHostingMenu.map((item) => {
                  const targetUrl = settings?.[item.key as keyof WebsiteSettings] as string || "https://host.amarshebahost.com";
                  return (
                    <a
                      key={item.key}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-left text-sm py-1.5 text-gray-400 hover:text-brand transition-colors flex items-center justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>★ {item.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-40 ml-1 inline-block shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Custom Dynamic Navigation Menus in mobile drawer */}
            {settings?.customMenuItems && settings.customMenuItems.length > 0 && (
              <div className="border-t border-gray-800 pt-3">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">More Links</span>
                <div className="grid grid-cols-1 gap-1 pl-2">
                  {settings.customMenuItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      className="text-left text-sm py-1.5 text-gray-400 hover:text-brand transition-colors flex items-center justify-between"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>★ {item.label}</span>
                      {item.isExternal && <ExternalLink className="w-3 h-3 opacity-40 ml-1 inline-block shrink-0" />}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {navMenuItems.slice(1).map((item) => (
              <button
                key={item.slug}
                onClick={() => handleLinkClick(item.slug)}
                className={`text-left text-base font-semibold tracking-wide py-2 border-t border-gray-800 pt-3 ${
                  currentRoute === item.slug ? "text-brand" : "text-gray-300"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Session Access inside drawer */}
            <div className="border-t border-gray-800 pt-4 flex flex-col space-y-3">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 font-mono">
                    Logged in: <span className="text-white">{currentUser.name}</span> ({currentUser.role})
                  </div>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => handleLinkClick("admin")}
                      className="w-full py-2.5 rounded-sm bg-white text-black font-bold uppercase tracking-wider text-xs text-center block"
                    >
                      Admin Panel Control
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-sm border border-red-500/30 text-red-400 font-bold uppercase tracking-wider text-xs text-center block"
                  >
                    Logout from Session
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleLinkClick("login")}
                    className="py-2.5 rounded-sm border border-brand/50 text-white font-bold uppercase tracking-wider text-xs text-center"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleLinkClick("signup")}
                    className="py-2.5 rounded-sm bg-brand text-black font-bold uppercase tracking-wider text-xs text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
