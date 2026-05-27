import { registerUser } from "@/lib/actions/auth.action";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join U7 Fitness</h1>
          <p className="text-neutral-400">Create your member account</p>
        </div>

        <form action={registerUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
            <input name="name" type="text" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <input name="email" type="email" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Mobile Number</label>
            <input name="mobile" type="tel" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <input name="password" type="password" required className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div className="pt-2">
            <label className="block text-sm font-bold text-red-500 mb-1">Secret Gym Code</label>
            <input name="secretCode" type="password" required placeholder="Ask staff for code" className="w-full bg-neutral-950 border border-red-900/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 transition-colors" />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 mt-4 rounded-lg transition-colors">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-400">
          Already a member? {" "}
          <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}