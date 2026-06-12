import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck } from "lucide-react";

interface ContactFormProps {
  address: string;
  whatsapp: string;
}

export default function ContactForm({ address, whatsapp }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !message) {
      setError("Please fill in all requested fields (Name, Email, Message).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/public/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to deliver contact message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans" id="contact-form-section">
      
      {/* Title Segment */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-5xl font-black font-display tracking-tight text-white uppercase">
          Ignite Your <span className="text-brand">Reach</span>
        </h2>
        <div className="w-16 h-1 bg-brand mx-auto mt-4 mb-4" />
        <p className="text-gray-400 text-sm leading-relaxed">
          Ready to transition your business to the next level of visual authority? Connect with us today. Our professional architects and copywriters respond with customized plans in under 12 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="bg-dark-card border border-gray-800 rounded-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold tracking-wide text-sm uppercase">Creative Headquarters</h4>
                <p className="text-gray-400 text-xs leading-relaxed mt-2 font-mono">
                  {address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-gray-800 rounded-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold tracking-wide text-sm uppercase">WhatsApp Agency Hotline</h4>
                <p className="text-gray-400 text-xs mt-2 font-mono font-bold text-brand hover:underline">
                  <a href={`https://wa.me/88${whatsapp}`} target="_blank" rel="noopener noreferrer">
                    +88 {whatsapp}
                  </a>
                </p>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">Direct Chat • Always live</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-gray-800 rounded-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-sm text-brand group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold tracking-wide text-sm uppercase">Support Inbox</h4>
                <p className="text-gray-400 text-xs mt-2 font-mono">
                  support@pixelagency.com
                </p>
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">● 24/7 Live Response SLA</span>
              </div>
            </div>
          </div>

          {/* Secure Trust Banner */}
          <div className="bg-brand/5 border border-brand/10 rounded-sm p-6 flex items-center space-x-4">
            <ShieldCheck className="w-10 h-10 text-brand shrink-0" />
            <div className="text-xs">
              <h5 className="font-semibold text-white">Project Security Assured</h5>
              <p className="text-gray-400 mt-1">All data transmission is encrypted. No unsolicited marketing spam, ever.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Submission Panel */}
        <div className="lg:col-span-8">
          <div className="bg-dark-card border border-gray-800 rounded-sm p-8 shadow-none relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-brand" />
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-sm text-xs text-emerald-400 leading-relaxed font-mono">
                ✓ Message received successfully! Thank you for contacting Pixel Agency. Our lead copywriter will reach out to you via WhatsApp or Email within 12 hours.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-sm text-xs text-red-400 leading-relaxed font-mono">
                ⚠ Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" id="form-contact-agency">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                    Full Name <span className="text-brand">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                    Email Address <span className="text-brand">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@corporate.com"
                    className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                  Phone Number <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01837679963"
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                  Your Brief / Project Needs <span className="text-brand">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your visual design, video editing, or web platform requirements in detail..."
                  className="w-full bg-black/50 border border-gray-800 focus:border-brand rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <span className="text-[10px] text-gray-500 font-mono flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Need urgent dispatch? Consider clicking the WhatsApp floating badge.</span>
                </span>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-black py-3 px-8 rounded-sm font-bold font-display tracking-wider transition-all disabled:opacity-50 inline-flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <span>{loading ? "Sending Message..." : "DELIVER BRIEF"}</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Embedded Map Section */}
      <div className="mt-16 font-sans">
        <h3 className="text-white font-display font-bold text-lg tracking-wide uppercase mb-4 pl-3 border-l-2 border-brand">
          Geographic Location
        </h3>
        <div className="w-full h-[40vh] rounded-sm overflow-hidden border border-gray-800 bg-dark-card group">
          {/* Kishoreganj Austagram Premium styled Google Map embed */}
          <iframe
            title="Pixel Agency Geographic map location in Jamtoli, Austagram"
            src="https://maps.google.com/maps?q=Jamtoli,%20Austagram,%20Kishoreganj,%20Bangladesh&t=k&z=14&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-none filter invert brightness-90 contrast-125"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="text-[10px] text-gray-500 font-mono mt-2 text-right">
          📍 HQ Reference: Jamtoli, Austagram, Kishoreganj-2380, Bangladesh
        </p>
      </div>

    </div>
  );
}
