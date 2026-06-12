import { MapPin, Phone, MessageSquare, Shield, ScrollText, RotateCcw } from "lucide-react";
import { Service } from "../types";

interface FooterProps {
  services: Service[];
  onNavigate: (section: string) => void;
  address: string;
  whatsapp: string;
}

export default function Footer({ services, onNavigate, address, whatsapp }: FooterProps) {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 font-sans" id="app-footer">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate("home")}>
              <span className="w-8 h-8 rounded-sm bg-brand flex items-center justify-center font-display font-bold text-black text-xl">P</span>
              <span className="text-xl font-bold font-display tracking-tighter uppercase text-white">
                PIXEL<span className="text-brand"> AGENCY</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              We design and construct top-tier digital assets, engineered specifically to accelerate organic reach, improve user credibility, and boost conversions.
            </p>
            <div className="flex items-center space-x-4">
              <a href={`https://wa.me/88${whatsapp}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-sm bg-dark-card border border-gray-800 flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-sm bg-dark-card border border-gray-800 flex items-center justify-center hover:border-brand hover:text-brand transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold tracking-wider text-sm uppercase mb-6 border-l-2 border-brand pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-none">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("pricing")} className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-none">
                  SaaS Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-none">
                  About Our Crew
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-none">
                  Contact Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Our Core Services */}
          <div>
            <h3 className="text-white font-display font-semibold tracking-wider text-sm uppercase mb-6 border-l-2 border-brand pl-3">
              Digital Services
            </h3>
            <ul className="space-y-3 text-sm">
              {services.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.slug)}
                    className="hover:text-brand transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-display font-semibold tracking-wider text-sm uppercase mb-6 border-l-2 border-brand pl-3">
              Office HQ
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand" />
                <span>+88 {whatsapp}</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-brand" />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-sm border border-brand/20 bg-brand/5 text-brand uppercase tracking-widest text-[10px]">
                  24/7 Live Work Status
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="h-[1px] bg-gray-800 my-12" />

        {/* Sub-footer links & copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => onNavigate("privacy")} className="flex items-center space-x-1 hover:text-brand transition-colors">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button onClick={() => onNavigate("terms")} className="flex items-center space-x-1 hover:text-brand transition-colors">
              <ScrollText className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
            </button>
            <button onClick={() => onNavigate("refund")} className="flex items-center space-x-1 hover:text-brand transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refund Policy</span>
            </button>
          </div>
          
          <p className="text-gray-500 font-mono">
            &copy; 2026 Pixel Agency. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
