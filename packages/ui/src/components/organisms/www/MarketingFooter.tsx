import { Mail, Scale, Shield } from "lucide-react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Link } from "react-router";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-12">
      <CardWithLabel
        label="The Platform"
        className="border-t-4 border-l-0 border-r-0 border-b-0 rounded-none bg-white"
        labelClassName="bg-yellow-400 text-black border-2 border-black italic font-black uppercase text-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 border-2 border-black shadow-[4px_4px_0_0_rgba(250,204,21,1)]">
                <Scale className="text-white" size={24} />
              </div>
              <p className="text-3xl font-black italic uppercase tracking-tighter">
                Mahakama
              </p>
            </div>
            <p className="font-bold text-sm max-w-sm leading-relaxed">
              Empowering citizens in South Sudan and East Africa through
              AI-driven legal discovery and verified professional connections.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Mail} href="#" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black uppercase text-xs tracking-widest text-zinc-400">
              Application
            </h4>
            <ul className="space-y-2 font-bold text-sm">
              <li>
                <Link
                  to="/find-a-lawyer"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Find a Lawyer
                </Link>
              </li>
              <li>
                <Link
                  to="/legal-database"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Legal Database
                </Link>
              </li>
              <li>
                <Link
                  to="/justice-hub"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Justice Hub
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black uppercase text-xs tracking-widest text-zinc-400">
              Resources
            </h4>
            <ul className="space-y-2 font-bold text-sm">
              <li>
                <Link
                  to="/help"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:underline decoration-yellow-400 decoration-2"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
          <p className="text-xs font-black uppercase italic">
            &copy; {currentYear} Mahakama &mdash; Secure Justice Portal
          </p>
          <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1 border-2 border-black text-[10px] font-black uppercase">
            <Shield size={12} /> Data Privacy Encrypted
          </div>
        </div>
      </CardWithLabel>
    </footer>
  );
}

function SocialLink({ icon: Icon, href }: { icon: any; href: string }) {
  return (
    <a
      href={href}
      className="p-2 border-2 border-black hover:bg-yellow-400 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
    >
      <Icon size={18} />
    </a>
  );
}
