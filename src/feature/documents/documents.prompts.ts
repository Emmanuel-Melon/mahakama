const systemPrompt = ``;

type MostRelevantLaws = {
  chunks: string[];
};

const extractChunks = (chunks: string[]): string => {
  return `
    [Chunk 1: Constitution of Uganda, Section 26]
    {text}
    [Chunk 2: Landlord and Tenant Act, Section 5]
    {text}
    `;
};

export const generateDocumentPrompt = (
  query: string,
  mostRelevantLaws: MostRelevantLaws,
) => {
  const chunks = extractChunks(mostRelevantLaws.chunks);
  const prompt = `
Given these legal provisions: ${chunks}
Question: ${query}

Provide a clear answer citing specific sections.
`;

  return prompt;
};
