import { HeroSection } from "~/components/HeroSection";
import { DocumentList, AboutLegalDatabase } from "~/components/legal-database";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { Library } from 'lucide-react';

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

export default function LegalDatabase() {
  return (
    <div className="min-h-screen">
      <HeroSection 
        title="Legal Database"
        description="Access a comprehensive collection of legal documents, acts, and regulations. Stay informed with the latest legal resources and references."
        actionVariant="search"
        icon={Library}
      />
      <DiagonalSeparator />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-foreground mb-2">Legal Database</h1>
          <p className="text-muted-foreground mb-8">
            Access the complete collection of laws and legal documents. Each document is available in its original form
            with version history and amendments. Our AI helps you navigate and understand these complex legal texts.
          </p>
          
          <DocumentList documents={legalDocuments} />
          <AboutLegalDatabase />
        </div>
      </div>
    </div>
  );
}
