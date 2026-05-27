import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BmiCalculator } from "@/components/BmiCalculator";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  MessageSquare,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 bg-gradient-radial from-red-950/10 via-black to-black">
        <div className="absolute inset-0 bg-gradient-red animate-pulse-slow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-900/40 text-red-500 text-xs font-bold uppercase tracking-widest">
              <Zap className="h-3 w-3" /> Palam Colony's Elite Fitness Hub
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-tight">
              Unleash Your <br />
              <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">Ultimate Strength</span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-lg leading-relaxed">
              Step into U7 Fitness Gym. Get access to top-tier equipment, custom coaching from professional trainers, and join a dedicated fitness community near Solanki Chowk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-lg text-center transition-all shadow-lg shadow-red-900/30"
              >
                Start Free Trial
              </Link>
              <Link
                href="#plans"
                className="px-8 py-4 border border-zinc-800 hover:border-red-600/30 hover:bg-red-950/20 text-zinc-200 font-bold rounded-lg text-center transition-all"
              >
                View Memberships
              </Link>
            </div>
          </div>

          {/* Graphic Side */}
          <div className="relative flex justify-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-zinc-900 opacity-30 blur-lg" />
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-800/80 w-full max-w-md relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Stats</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-zinc-500 text-xs uppercase font-medium">Active Members</span>
                  <span className="text-3xl font-black text-white mt-1">50+</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between">
                  <span className="text-zinc-500 text-xs uppercase font-medium">Pro Trainers</span>
                  <span className="text-3xl font-black text-white mt-1">2</span>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-zinc-950 border border-red-900/20">
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Today's Quote</p>
                <p className="text-sm text-zinc-300 italic mt-1">"The only bad workout is the one that didn't happen."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Why Train At <span className="text-red-600">U7 Fitness</span>?
            </h2>
            <p className="text-zinc-400 mt-4">We provide premium amenities and tracking resources to accelerate your fitness gains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 rounded-xl border border-zinc-800/80 hover:border-red-600/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-red-950/50 flex items-center justify-center text-red-500 border border-red-900/30 mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-2">Modern Equipment</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Train on commercial-grade treadmills, heavy squat racks, bumper plates, and ergonomic cable setups suited for all strengths.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 rounded-xl border border-zinc-800/80 hover:border-red-600/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-red-950/50 flex items-center justify-center text-red-500 border border-red-900/30 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-2">Expert Coaching</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Work directly with our 2 resident fitness specialists to map out workout paths, correct forms, and check nutritional intake.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 rounded-xl border border-zinc-800/80 hover:border-red-600/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-red-950/50 flex items-center justify-center text-red-500 border border-red-900/30 mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase mb-2">PWA Member Portal</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Install our PWA to log lifting Personal Records (PRs), monitor bodyweight changes, verify attendance logs, and check dues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans Section */}
      <section id="plans" className="py-20 bg-black border-t border-zinc-900 relative">
        <div className="absolute inset-0 bg-gradient-radial from-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Membership <span className="text-red-600">Pricing</span>
            </h2>
            <p className="text-zinc-400 mt-4">Simple, transparent pricing with no hidden joining fees. Select the plan that fits your gym goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan 1 */}
            <div className="glass-card p-8 rounded-2xl border border-zinc-800 hover:border-red-600/30 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase">Gym Membership</h3>
                    <p className="text-xs text-zinc-500 mt-1">Full weightroom access</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">Popular</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-white">₹1200</span>
                  <span className="text-zinc-500 text-sm ml-1">/ month</span>
                </div>
                <ul className="space-y-3 pt-6 border-t border-zinc-900">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-500" /> Complete strength equipment access
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-500" /> Locker and changing rooms
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-500" /> Digital progress & check-in tracker
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className="block w-full py-3 text-center bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white font-bold rounded-lg border border-zinc-800 hover:border-red-600 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="glass-card p-8 rounded-2xl border-2 border-red-600/50 hover:border-red-600 transition-all flex flex-col justify-between relative overflow-hidden group bg-gradient-to-b from-red-950/10 to-transparent">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                Recommended
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase">Cardio + Gym</h3>
                    <p className="text-xs text-red-400 mt-1">Weightroom + Cardio section</p>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-white">₹1500</span>
                  <span className="text-zinc-500 text-sm ml-1">/ month</span>
                </div>
                <ul className="space-y-3 pt-6 border-t border-zinc-900">
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-600" /> All Gym Membership privileges
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-600" /> Dedicated high-end cardio zone
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 text-red-600" /> 1-on-1 routine consultation
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className="block w-full py-3 text-center bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20"
                >
                  Join Cardio + Gym
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive BMI Section */}
      <section id="bmi" className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              Calculate Your <span className="text-red-600">BMI</span> Status
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Body Mass Index (BMI) is a convenient indicator of body fatness based on height and weight. Use our interactive calculator to see your range, then adjust your training and nutritional targets accordingly with our staff.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-red-950/40 text-red-500 border border-red-900/30 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold text-base">Underweight (&lt; 18.5)</h4>
                  <p className="text-zinc-500 text-sm">Need caloric surplus and hypertrophy planning.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-red-950/40 text-red-500 border border-red-900/30 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold text-base">Normal Weight (18.5 - 24.9)</h4>
                  <p className="text-zinc-500 text-sm">Ideal bodyweight ratio. Focus on conditioning and power.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-red-950/40 text-red-500 border border-red-900/30 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold text-base">Overweight & Obese (25+)</h4>
                  <p className="text-zinc-500 text-sm">Requires compound lift tracking and steady-state cardiovascular programs.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <BmiCalculator />
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 bg-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Professional <span className="text-red-600">Trainers</span>
            </h2>
            <p className="text-zinc-400 mt-4">Learn from certified coaching staff dedicated to helping you lift safely and achieve results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Trainer 1 */}
            <div className="glass-card p-6 rounded-2xl border border-zinc-800/80 hover:border-red-600/30 transition-all flex flex-col sm:flex-row gap-6 items-center">
              <div className="h-32 w-32 rounded-xl bg-zinc-900 flex items-center justify-center text-red-600 border border-zinc-800 shrink-0 font-black text-4xl">
                T1
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white">Trainer Amit Sharma</h3>
                <span className="text-xs text-red-500 uppercase tracking-widest font-semibold">Head Strength Coach</span>
                <p className="text-zinc-400 text-sm">Specializes in bodybuilding, powerlifting form corrections, and customized heavy lifting plans.</p>
                <div className="flex justify-center sm:justify-start gap-3 pt-2 text-zinc-500">
                  <span className="text-xs bg-zinc-950 border border-zinc-900 px-2 py-1 rounded">10+ Yrs Exp</span>
                  <span className="text-xs bg-zinc-950 border border-zinc-900 px-2 py-1 rounded">Certified Personal Trainer</span>
                </div>
              </div>
            </div>

            {/* Trainer 2 */}
            <div className="glass-card p-6 rounded-2xl border border-zinc-800/80 hover:border-red-600/30 transition-all flex flex-col sm:flex-row gap-6 items-center">
              <div className="h-32 w-32 rounded-xl bg-zinc-900 flex items-center justify-center text-red-600 border border-zinc-800 shrink-0 font-black text-4xl">
                T2
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white">Trainer Rahul Verma</h3>
                <span className="text-xs text-red-500 uppercase tracking-widest font-semibold">Cardio & HIIT Coach</span>
                <p className="text-zinc-400 text-sm">Specializes in high-intensity cardiovascular conditioning, athletic weight loss, and core workouts.</p>
                <div className="flex justify-center sm:justify-start gap-3 pt-2 text-zinc-500">
                  <span className="text-xs bg-zinc-950 border border-zinc-900 px-2 py-1 rounded">6+ Yrs Exp</span>
                  <span className="text-xs bg-zinc-950 border border-zinc-900 px-2 py-1 rounded">Nutrition Specialist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Member <span className="text-red-600">Testimonials</span>
            </h2>
            <p className="text-zinc-400 mt-4">Hear what our active members say about their transformations at U7 Fitness Gym.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl border border-zinc-800/80">
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "U7 Gym has completely changed my fitness outlook. The trainers Amit and Rahul are incredibly supportive, and the equipment is always clean and accessible."
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">Vikram Singh</span>
                <span className="text-xs text-red-500 font-semibold">Member since 2024</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-zinc-800/80">
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "Best gym in Palam Colony! The membership prices are very reasonable (only ₹1500 for cardio+gym), and the digital check-in interface is fantastic."
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">Priya Sharma</span>
                <span className="text-xs text-red-500 font-semibold">Member since 2025</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-zinc-800/80">
              <p className="text-zinc-300 text-sm italic leading-relaxed">
                "I track my bench and squat PRs directly inside the U7 member app. It's so clean, mobile-responsive, and helps me push myself every single week."
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">Deepak Rawat</span>
                <span className="text-xs text-red-500 font-semibold">Member since 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Gallery */}
      <section className="py-20 bg-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
              Transformation <span className="text-red-600">Gallery</span>
            </h2>
            <p className="text-zinc-400 mt-4">True stories of dedication, perseverance, and muscle growth at U7 Fitness Gym.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-4 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all flex flex-col justify-between">
              <div className="h-48 w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 font-bold mb-4 uppercase">
                Fat Loss: -18kg
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Amit K.</h4>
                <p className="text-zinc-400 text-xs mt-1">"Accomplished in 6 months using heavy compound training and cardio-gym program."</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all flex flex-col justify-between">
              <div className="h-48 w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 font-bold mb-4 uppercase">
                Muscle Gain: +12kg
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Rohan S.</h4>
                <p className="text-zinc-400 text-xs mt-1">"Bulked successfully under trainer supervision with strict deadlift and squat progressions."</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all flex flex-col justify-between">
              <div className="h-48 w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 font-bold mb-4 uppercase">
                Strength Boost
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Karan P.</h4>
                <p className="text-zinc-400 text-xs mt-1">"Increased deadlift PR from 100kg to 160kg in 8 months of consistent logs."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
                Find Us & <span className="text-red-600">Get in Touch</span>
              </h2>
              <p className="text-zinc-400 mt-2">Come down for a facility walkthrough or drop us a message directly.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Address</h4>
                  <p className="text-zinc-400 text-sm mt-1">Near Solanki Chowk, Palam Colony, New Delhi - 110045</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Gym Timings</h4>
                  <p className="text-zinc-400 text-sm mt-1">
                    Morning: 05:00 AM - 10:00 AM <br />
                    Evening: 04:00 PM - 10:00 PM <br />
                    <span className="text-red-500 font-bold text-xs uppercase tracking-wider mt-1 block">Sunday Closed</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Contact Support</h4>
                  <p className="text-zinc-400 text-sm mt-1">Mobile: +91 99999 88888</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="pt-4">
              <a
                href="https://wa.me/919999988888?text=Hello%20U7%20Fitness%20Gym%2C%20I%20am%20interested%20in%20joining%20the%20gym.%20Please%20provide%20membership%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-950/20 uppercase text-sm tracking-wider"
              >
                <MessageSquare className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Maps Embed */}
          <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.208753234907!2d77.08639209999999!3d28.5935069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b463da24a73%3A0xe6bf4b62dbef329f!2sPalam%20Colony%2C%20Palam%2C%20Delhi%2C%20110045!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 py-12 text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white tracking-widest uppercase">
              U7 <span className="text-red-600">Fitness</span>
            </span>
          </div>
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} U7 Fitness Gym. Near Solanki Chowk, Palam Colony, New Delhi. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-red-500 transition-colors" title="Instagram">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-red-500 transition-colors" title="Facebook">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V0h-3C9.54 0 9 1.46 9 3v5z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}