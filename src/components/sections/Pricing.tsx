"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Standard Gym",
    price: "₹1200",
    features: ["Access to weight floor", "Locker room access", "Basic equipment orientation", "Open gym hours"],
    recommended: false,
  },
  {
    name: "Cardio + Gym",
    price: "₹1500",
    features: ["Full standard gym access", "Unlimited cardio machines", "Priority trainer support", "Custom diet consultation"],
    recommended: true,
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Membership <span className="text-red-600">Plans</span></h2>
          <p className="text-neutral-400">Simple, transparent pricing. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-8 rounded-2xl border ${plan.recommended ? 'bg-red-950/20 border-red-600/50' : 'bg-neutral-900 border-neutral-800'}`}
            >
              {plan.recommended && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-neutral-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-neutral-300">
                    <CheckCircle2 className="text-red-500 mr-3" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.recommended ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}