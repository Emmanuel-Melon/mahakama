export function AboutLegalDatabase() {
  return (
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
  );
}
