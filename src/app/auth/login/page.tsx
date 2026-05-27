import { signIn } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">U7 Fitness</h1>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>

        <form action={async (formData) => {
          "use server"
          await signIn("credentials", formData)
        }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-400">
          New member? {" "}
          <Link href="/register" className="text-red-500 hover:text-red-400 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}