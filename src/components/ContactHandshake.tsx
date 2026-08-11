"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ContactHandshake() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      const mailtoUrl = `mailto:iftkhar00490@gmail.com?subject=${encodeURIComponent("Portfolio Contact from " + email)}&body=${encodeURIComponent(message + "\n\nSender: " + email)}`;
      window.location.href = mailtoUrl;
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-black text-white py-20 px-6 md:px-16 overflow-hidden border-t border-neutral-900">
      {/* Decorative Technical HUD Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
        style={{ maskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-sans font-light tracking-tight text-white">
            Initiate Contact
          </h2>
        </div>

        {/* Stark Minimalist Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl font-sans text-xs text-neutral-400 flex flex-col gap-2"
              >
                <div className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span>Opening Mail Client...</span>
                </div>
                <p>Form initialized mailto dispatch to iftkhar00490@gmail.com.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                    Sender Address (Email)
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 font-mono text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors duration-300"
                  />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                    Secure Payload (Message)
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter payload message details..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 font-mono text-xs text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors duration-300 resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full md:w-auto self-start px-6 py-3.5 bg-white text-black font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            )}
          </div>

          {/* Social Indicators & Links (Right side) */}
          <div className="flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                External Directories
              </span>
              
              <div className="flex flex-col gap-3 font-mono text-xs">
                {/* GitHub link */}
                <a 
                  href="https://github.com/iftkhar00490" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-500 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>GITHUB</span>
                  </div>
                </a>

                {/* LinkedIn link */}
                <a 
                  href="https://www.linkedin.com/in/shaikh-iftkhar-986429197" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-500 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span>LINKEDIN</span>
                  </div>
                </a>

                {/* Instagram link */}
                <a 
                  href="https://www.instagram.com/shaikh.visuals/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-500 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>INSTAGRAM</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Direct coordinate status card Placeholder */}
          </div>
        </div>



        {/* Footer legalities & simple mark */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-neutral-600 tracking-wider">
          <div suppressHydrationWarning>© {new Date().getFullYear()} ME_PORTFOLIO. ALL RIGHTS PRESERVED.</div>
        </div>

      </div>
    </footer>
  );
}
