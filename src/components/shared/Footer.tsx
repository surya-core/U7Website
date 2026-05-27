import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">U7 FITNESS</h3>
            <p className="text-neutral-400">Where discipline meets results. Join our community of 50+ active members pushing their limits every day.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Location</h4>
            <div className="flex items-start text-neutral-400 space-x-3">
              <MapPin className="text-red-500 shrink-0 mt-1" size={20} />
              <p>Near Solanki Chowk<br />Palam Colony, ND-110045<br />Delhi, India</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="https://wa.me/YOUR_NUMBER" className="flex items-center text-neutral-400 hover:text-white transition-colors">
                <Phone className="text-red-500 mr-3" size={20} />
                WhatsApp Us
              </a>
              <div className="flex items-center text-neutral-400">
                <Mail className="text-red-500 mr-3" size={20} />
                info@u7fitness.com
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-neutral-600 text-sm border-t border-neutral-900 pt-8">
          © {new Date().getFullYear()} U7 Fitness Gym. All rights reserved.
        </div>
      </div>
    </footer>
  );
}