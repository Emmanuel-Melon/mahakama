import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { Mail, Send, MapPin, Globe } from "lucide-react";

export const ContactScreen = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl uppercase">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl">
          Whether you are a legal professional managing cases or a user seeking
          justice across East Africa, our regional teams are ready to assist.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CardWithLabel label="Message" className="h-full">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    className="w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="Emmanuel"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    className="w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none"
                    placeholder="Gatwech"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="emmanuel@mahakama.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Regional Subject
                </label>
                <select className="w-full p-3 border-2 border-black rounded bg-white font-bold">
                  <option>General Inquiry</option>
                  <option>Justice Hub Assistance (South Sudan)</option>
                  <option>Legal Database Request (Uganda/Kenya)</option>
                  <option>Lawyer Verification Support</option>
                  <option>Case Management Technical Help</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 border-2 border-black rounded focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black font-black uppercase py-4 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">
                <Send size={20} />
                Send to Mahakama Support
              </button>
            </form>
          </CardWithLabel>
        </div>

        <div className="space-y-6">
          <CardWithLabel label="Regional Presence">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Globe className="shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-sm">East African Support</h3>
                  <p className="text-xs text-muted-foreground">
                    South Sudan, Kenya, Uganda, Rwanda, Tanzania
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-sm">Headquarters</h3>
                  <p className="text-xs text-muted-foreground">
                    Kigali, Rwanda
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-sm">Direct Email</h3>
                  <p className="text-xs font-bold">support@mahakama.com</p>
                </div>
              </div>
            </div>
          </CardWithLabel>

          <CardWithLabel label="Response Time" className="bg-zinc-50">
            <p className="text-sm italic">
              "We aim to respond to all inquiries within 24 hours during
              standard East Africa Time (EAT) business hours."
            </p>
          </CardWithLabel>
        </div>
      </div>
    </div>
  );
};
