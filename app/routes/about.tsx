import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Mahakama - Free Legal Knowledge for East Africa" },
    { name: "description", content: "Mahakama provides free, accessible legal information for South Sudan and Uganda through AI-powered semantic search. Understand your rights in plain language without needing a lawyer." },
    { name: "keywords", content: "free legal help South Sudan, Uganda legal information, East Africa law, understand my rights, legal questions, no lawyer needed, legal self-help" },
  ];
}

const features = [
  {
    title: "Natural Language Search",
    description: "Search using everyday language - no legal jargon required. Ask questions like 'What should I do if my landlord changes the locks?' and get relevant legal information.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  },
  {
    title: "East Africa Focus",
    description: "Currently covering South Sudan and Uganda, with plans to expand across East Africa. All legal information is locally relevant and up-to-date.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
      <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.35.142l-3.133-.85a.75.75 0 00-.51 0l-3.134.85a1.875 1.875 0 01-1.35-.142l-4.874-2.437A1.875 1.875 0 012.25 17.306V4.82c0-.72.428-1.368 1.087-1.676l2.824-1.284zm.617 1.423a.375.375 0 00-.356 0L3.75 4.94v11.81l4.813-2.407a.375.375 0 01.27-.028l3.12.848.008.002.007-.002 3.12-.848a.375.375 0 01.27.028l4.812 2.408V4.94l-3.1-1.55a.375.375 0 00-.356 0l-4.869 2.434a1.375 1.375 0 01-1.21 0L8.778 4.002z" clipRule="evenodd" />
    </svg>
  },
  {
    title: "100% Free & Accessible",
    description: "Completely free to use with no hidden costs. We believe in making legal knowledge accessible to everyone, regardless of their financial situation.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
      <path d="M10.464 8.746c.227-.18.497-.287.786-.295h2.478c.348 0 .668.18.85.475.23.365.12.85-.26 1.087l-3.5 2.25a1.125 1.125 0 01-1.395-.001l-3.5-2.25a1.125 1.125 0 01-.26-1.086.911.911 0 01.85-.48h2.478c.29 0 .559.114.785.295l.002.001.003.002.01.007.034.025a.75.75 0 00.12.072l.017.01c.172.1.4.1.56.1z" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.006a.75.75 0 00.402.663l5.25 3.15a.75.75 0 10.776-1.296l-1.85-1.11A8.25 8.25 0 0112.75 6z" clipRule="evenodd" />
    </svg>
  }
];

export default function About() {
  return (
    <section className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Free Legal Knowledge for East Africa</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get clear answers to your legal questions in plain language. No legal background needed, and it's completely free.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <div className="prose prose-lg text-muted-foreground mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Legal Knowledge, Made Simple</h2>
          <p className="mb-6">
            In South Sudan and Uganda, accessing legal information is often expensive and confusing. Government legal databases exist, but they're filled with complex terminology that's hard to understand without a law degree.
          </p>
          <p className="mb-6">
            Mahakama changes that. Our AI-powered platform is completely free and lets you search using everyday language. Don't know the legal term for your issue? No problem. Just describe your situation as you would to a friend, and we'll find the relevant laws and regulations for you.
          </p>
          <p>
            While we can connect you with legal professionals if absolutely necessary, our primary goal is to empower you with knowledge first. Most legal questions can be resolved by understanding your rights and options - no lawyer required.
          </p>
        </div>
        
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Get Legal Answers in 3 Simple Steps</h2>
          <ul className="grid md:grid-cols-3 gap-6">
            <li className="flex flex-col items-center text-center gap-3 p-6 bg-background/50 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">1</div>
              <div>
                <h3 className="font-medium text-foreground">Ask Your Question</h3>
                <p className="text-muted-foreground text-sm mt-1">Type your legal question in everyday language, just like you'd ask a friend</p>
              </div>
            </li>
            <li className="flex flex-col items-center text-center gap-3 p-6 bg-background/50 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">2</div>
              <div>
                <h3 className="font-medium text-foreground">Get Clear Answers</h3>
                <p className="text-muted-foreground text-sm mt-1">Receive relevant legal information without confusing legal jargon</p>
              </div>
            </li>
            <li className="flex flex-col items-center text-center gap-3 p-6 bg-background/50 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">3</div>
              <div>
                <h3 className="font-medium text-foreground">Understand Your Rights</h3>
                <p className="text-muted-foreground text-sm mt-1">Learn what your rights are and what actions you can take next</p>
              </div>
            </li>
          </ul>
          <p className="text-center text-muted-foreground text-sm mt-6">
            Only if your situation is complex, we can help you find a lawyer in our network
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {features.map((feature, index) => (
          <div key={index} className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Legal Services Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl border border-primary/20">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                  <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                  <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Need More Help?</h2>
              <p className="text-muted-foreground">Connect with verified legal professionals when you need expert assistance.</p>
            </div>
            <div className="md:w-2/3">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-white/50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Legal Consultation</h3>
                    <p className="text-sm text-muted-foreground">Get personalized advice from experienced lawyers in our network</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Document Review</h3>
                    <p className="text-sm text-muted-foreground">Have legal documents reviewed by professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Case Representation</h3>
                    <p className="text-sm text-muted-foreground">Find representation for your legal matters when needed</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a 
                  href="/lawyers" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse Legal Professionals
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
