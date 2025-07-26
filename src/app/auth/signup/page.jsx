'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedTestimonials } from "../../../components/ui/animated-testimonials";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 for details, 2 for OTP
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const testimonials = [
    {
      quote: "This platform is amazing! It's so easy to use and has helped me a lot.",
      name: "Vishesh",
      designation: "Developer",
      src: "https://wallpapers.com/images/featured/anime-boy-dark-oltg2lztxcu00bec.jpg",
    },
    {
      quote: "I love the user interface. It's clean, modern, and intuitive.",
      name: "Vishesh",
      designation: "Designer",
      src: "https://img.freepik.com/premium-vector/vector-young-man-animestyle-character-vector-illustration-design-manga-anime-boy_147933-12515.jpg?semt=ais_hybrid&w=740",
    },
    {
      quote: "I love the user interface. It's clean, modern, and intuitive.",
      name: "Vishesh",
      designation: "Engineer",
      src: "https://media.craiyon.com/2025-04-12/pyJGEfq0T--2bGrq-WHFFQ.webp",
    },
    {
      quote: "I love the user interface. It's clean, modern, and intuitive.",
      name: "Vishesh",
      designation: "Bug Hunter",
      src: "https://images.steamusercontent.com/ugc/965355694153811922/DF6B86B28B17363E7529D2980F1580D221B2B96D/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/signin"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-center">
            {step === 1 ? "Create Your Account" : "Verify Your Email"}
          </h1>

          {error && <p className="mb-4 text-sm text-center text-red-400">{error}</p>}
          {success && <p className="mb-4 text-sm text-center text-white-400">{success}</p>}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" onChange={handleChange} placeholder="John Doe" required />
              </div>

              <div>
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@chitkara.edu.in"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Password" onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="Ph. No." onChange={handleChange} required />
              </div>

<button
  type="submit"
  disabled={isLoading}
  className="w-full py-2 text-white bg-neutral-800 rounded-md disabled:bg-gray-500"
>
  {isLoading ? "Sending..." : "Send Verification Code"}
</button>

            </form>
          ) : (
            <form onSubmit={handleVerifyAndSignUp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-white bg-neutral-800 rounded-md disabled:bg-gray-500"
              >
                {isLoading ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </form>
          )}

          <p className="mt-4 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-white hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center bg-gray-900 w-1/2 p-10 text-white">
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </div>
  );
}
