"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Athlete <span className="text-red-600">Stories</span></h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 relative"
          >
            <Quote className="absolute top-4 right-4 text-neutral-800" size={48} />
            <p className="text-neutral-300 mb-6 relative z-10 italic">
              "The equipment here is absolutely top-notch. As someone who tracks every calorie burn on my Fitbit and focuses heavily on form for heavy barbell rows and cable pushdowns, U7 Fitness has exactly what I need. The front desk even stocks QNT protein for post-workout."
            </p>
            <div>
              <p className="font-bold text-white">Rahul Verma</p>
              <p className="text-sm text-red-500">Member since 2024</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 relative"
          >
            <Quote className="absolute top-4 right-4 text-neutral-800" size={48} />
            <p className="text-neutral-300 mb-6 relative z-10 italic">
              "The 2 professional trainers are phenomenal. They structure workouts with the precision of Mr. Olympia prep. Whether you are aiming for Derek Lunsford-level conditioning or just starting out, the environment pushes you."
            </p>
            <div>
              <p className="font-bold text-white">Aditya Sharma</p>
              <p className="text-sm text-red-500">Member since 2025</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}