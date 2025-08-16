'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatedTestimonials } from "../../../components/ui/animated-testimonials";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const testimonials = [
    {
      quote: "Building this voting platform has been an incredible journey. The seamless user experience and robust backend make every vote count!",
      name: "Atishya Jain",
      designation: "Full Stack Developer",
      src: "https://media.craiyon.com/2025-04-12/pyJGEfq0T--2bGrq-WHFFQ.webp",
    },
    {
      quote: "This platform showcases the power of modern web development. Clean code, beautiful design, and flawless functionality!",
      name: "Vishesh",
      designation: "Backend Developer",
      src: "https://img.freepik.com/premium-vector/vector-young-man-animestyle-character-vector-illustration-design-manga-anime-boy_147933-12515.jpg?semt=ais_hybrid&w=740",
    },
    {
      quote: "From concept to deployment, every feature was crafted with precision. Proud to be part of this innovative coding community!",
      name: "Aryan",
      designation: "Frontend Developer",
      src: "https://wallpapers.com/images/featured/anime-boy-dark-oltg2lztxcu00bec.jpg",
    },
  ];

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.ok) {
        router.push('/events');
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel: Form */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center p-10">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h2>

          {error && <p className="text-sm text-red-400 text-center mb-4">{error}</p>}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@johndoe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-neutral-800 rounded-md hover:bg-neutral-700 disabled:bg-gray-500"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-white hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel: Testimonials */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-900 w-1/2 p-10 text-white">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </div>
  );
}