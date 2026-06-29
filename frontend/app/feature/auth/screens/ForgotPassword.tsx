import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";

export const ForgotPasswordScreen = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger your API call here
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <CardWithLabel label="Account Recovery" className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-bold italic">
                  Enter the email address associated with your account and we'll
                  send you a link to reset your password.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-4 border-4 border-black focus:outline-none focus:bg-yellow-50 font-bold transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black font-black py-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase italic"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-black uppercase underline decoration-2 hover:text-yellow-600 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </form>
          </CardWithLabel>
        ) : (
          /* SUCCESS STATE */
          <CardWithLabel
            label="Check Your Inbox"
            className="bg-green-50 border-green-500"
          >
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full mb-2 text-green-600">
                <ShieldCheck size={32} />
              </div>
              <p className="font-bold italic">
                A password reset link has been sent to{" "}
                <span className="underline">{email}</span>.
              </p>
              <p className="text-sm text-zinc-600 font-medium">
                Please check your spam folder if you don't see it within a few
                minutes.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full mt-4 bg-black text-white font-black py-3 border-2 border-black hover:bg-zinc-800 transition-all uppercase text-xs"
              >
                Try a different email
              </button>
            </div>
          </CardWithLabel>
        )}
      </div>
    </div>
  );
};
