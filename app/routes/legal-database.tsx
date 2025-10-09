import { Link } from "react-router";
import { HeroSection } from "~/components/about/HeroSection";

export default function LegalDatabase() {
  const legalDocuments = [
    {
      id: 'constitution',
      title: 'National Constitution',
      description: 'The supreme law of the country, establishing the framework of government and fundamental rights.',
      lastUpdated: '2023',
      sections: 300,
      type: 'Constitutional Law'
    },
    {
      id: 'criminal-code',
      title: 'Criminal Code Act',
      description: 'Comprehensive legislation covering all criminal offenses and their corresponding penalties.',
      lastUpdated: '2022',
      sections: 412,
      type: 'Criminal Law'
    },
    {
      id: 'labor-act',
      title: 'Labor Act',
      description: 'Regulates employment relationships, working conditions, and workers\' rights.',
      lastUpdated: '2017',
      sections: 187,
      type: 'Labor Law'
    },
    {
      id: 'landlord-tenant',
      title: 'Landlord and Tenant Act',
      description: 'Governs the rental of residential and commercial properties and the rights of both parties.',
      lastUpdated: '2022',
      sections: 154,
      type: 'Property Law'
    },
    {
      id: 'consumer-protection',
      title: 'Consumer Protection Act',
      description: 'Protects consumers from unfair trade practices and ensures fair market competition.',
      lastUpdated: '2021',
      sections: 98,
      type: 'Commercial Law'
    },
    {
      id: 'civil-procedure',
      title: 'Civil Procedure Act',
      description: 'Rules and procedures for civil litigation in courts of law.',
      lastUpdated: '2021',
      sections: 203,
      type: 'Civil Procedure'
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection 
        title="Legal Database"
        description="Access a comprehensive collection of legal documents, acts, and regulations. Stay informed with the latest legal resources and references."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground mb-2">Legal Database</h1>
          <p className="text-muted-foreground mb-8">
            Access the complete collection of laws and legal documents. Each document is available in its original form
            with version history and amendments. Our AI helps you navigate and understand these complex legal texts.
          </p>
          
          <div className="space-y-6">
            {legalDocuments.map((doc) => (
              <div key={doc.id} className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{doc.title}</h2>
                    <p className="text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Last Updated: {doc.lastUpdated}</span>
                      <span>•</span>
                      <span>{doc.sections} Sections</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {doc.type}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/legal-database/${doc.id}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    View Details
                    <svg 
                      className="ml-1 w-4 h-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="text-lg font-medium text-foreground mb-3">About Our Legal Database</h3>
            <p className="text-muted-foreground mb-4">
              Our legal database is continuously updated to reflect the most current laws and regulations. 
              Each document includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Complete, unaltered legal text</li>
              <li>Version history and amendment tracking</li>
              <li>Cross-references to related laws and sections</li>
              <li>Plain-language summaries of key provisions</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Note:</strong> While we strive for accuracy, this information is for general guidance only. 
              For legal advice specific to your situation, please consult a qualified legal professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
