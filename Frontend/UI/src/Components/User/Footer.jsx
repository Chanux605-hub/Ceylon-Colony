// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: "#FBB01A" }} />
              <span className="text-xl font-bold">Ceylon Colony</span>
            </div>
            <p className="mt-3 text-white/70 text-sm">
              Pure Sri Lankan honey — from hive to jar. Ethical, traceable, and delicious.
            </p>

            {/* Socials */}
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon label="Instagram" href="#">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </SocialIcon>
              <SocialIcon label="Facebook" href="#">
                <path d="M13 22v-8h3l1-4h-4V7.5A2.5 2.5 0 0 1 15.5 5H17V1h-2A6 6 0 0 0 9 7v3H6v4h3v8h4z" />
              </SocialIcon>
              <SocialIcon label="YouTube" href="#">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.5-5.8zM10 15.5V8.5L16 12l-6 3.5z" />
              </SocialIcon>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-white/80 text-sm">
              {[
                ["Home", "/"],
                ["Products", "/products"],
                ["Workshops", "/workshops"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a className="hover:text-[#FBB01A] transition" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-4 space-y-2 text-white/80 text-sm">
              <li>100 South 17th Street</li>
              <li>Lyshorn St. Ames, NE 68502</li>
              <li>
                <a href="mailto:hello@ceyloncolony.com" className="hover:text-[#FBB01A]">
                  hello@ceyloncolony.com
                </a>
              </li>
              <li>
                <a href="tel:+94XXXXXXXXX" className="hover:text-[#FBB01A]">
                  +94 XXX XXX XXX
                </a>
              </li>
              <li>Mon–Sat, 8:00 AM – 6:00 PM</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold">Stay in the loop</h4>
            <p className="mt-2 text-white/70 text-sm">
              Deals, new batches, and workshop dates straight to your inbox.
            </p>
            <form
              className="mt-4 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // handle submit here
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Ceylon Colony. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-[#FBB01A]">Privacy</a>
            <span className="opacity-30">•</span>
            <a href="/terms" className="hover:text-[#FBB01A]">Terms</a>
            <span className="opacity-30">•</span>
            <a href="#top" className="hover:text-[#FBB01A]">Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function SocialIcon({ label, href, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid place-items-center h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
      title={label}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFF" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

export default Footer;
