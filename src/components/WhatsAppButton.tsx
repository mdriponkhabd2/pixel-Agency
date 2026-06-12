import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/8801837679963?text=Hello%20Digital%20Agency%20Pro%2C%20I%20am%20interested%20in%20your%20services.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-sm shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-black"
      id="whatsapp-floating-trigger"
      aria-label="Contact us on WhatsApp"
    >
      {/* Visual Ripple effect */}
      <span className="absolute inset-0 rounded-sm bg-[#25D366] opacity-25 animate-ping group-hover:animate-none"></span>
      
      <MessageCircle className="relative w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold font-display tracking-wider pl-0 group-hover:pl-2">
        WHATSAPP CHAT
      </span>
    </a>
  );
}
