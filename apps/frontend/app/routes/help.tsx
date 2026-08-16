import type { Route } from "./+types/about";
import { CardWithLabel } from "~/components/ui/card-with-label";
import {
  Search,
  BookOpen,
  Scale,
  ShieldQuestion,
  MessageCircle,
} from "lucide-react";

export default function HelpScreen() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl uppercase">How can we help, Emmanuel?</h1>
        <p className="text-muted-foreground">
          Search our resources or contact our regional support teams.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <CardWithLabel
          label="Knowledge"
          className="hover:border-yellow-400 transition-colors cursor-pointer"
        >
          <BookOpen className="mb-4 w-8 h-8" />
          <h3 className="font-bold">Legal Database Guide</h3>
          <p className="text-sm">
            Learn how to find and save regional laws like the Penal Code.
          </p>
        </CardWithLabel>

        <CardWithLabel
          label="Navigation"
          className="hover:border-yellow-400 transition-colors cursor-pointer"
        >
          <Scale className="mb-4 w-8 h-8" />
          <h3 className="font-bold">Justice Hub Basics</h3>
          <p className="text-sm">
            How to find Legal Aid and Ministry services in South Sudan or Kenya.
          </p>
        </CardWithLabel>

        <CardWithLabel
          label="Account"
          className="hover:border-yellow-400 transition-colors cursor-pointer"
        >
          <ShieldQuestion className="mb-4 w-8 h-8" />
          <h3 className="font-bold">Role Management</h3>
          <p className="text-sm">
            Switching between User and Lawyer profiles or updating credentials.
          </p>
        </CardWithLabel>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold pb-2">For Seekers (Users)</h2>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-white border border-black rounded shadow-sm">
              How do I verify a lawyer's experience?
            </li>
            <li className="p-3 bg-white border border-black rounded shadow-sm">
              Are the documents in the Legal Database official?
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold pb-2">
            For Professionals (Lawyers)
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-white border border-black rounded shadow-sm">
              How do I manage my "My Clients" dashboard?
            </li>
            <li className="p-3 bg-white border border-black rounded shadow-sm">
              Can I list services in multiple countries (e.g., Uganda & Rwanda)?
            </li>
          </ul>
        </div>
      </div>
      <CardWithLabel label="Contact Support" className="bg-yellow-400">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-bold text-lg">Still stuck?</p>
            <p className="text-sm">
              Our team is available Monday–Friday, 8 AM – 5 PM (EAT).
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded font-bold hover:bg-zinc-800">
              <MessageCircle size={18} /> Chat with us
            </button>
            <button className="flex items-center gap-2 border-2 border-black px-6 py-2 rounded font-bold hover:bg-white/50">
              Email Support
            </button>
          </div>
        </div>
      </CardWithLabel>
    </div>
  );
}
