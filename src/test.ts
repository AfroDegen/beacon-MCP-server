import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const auditInput = z.object({
  business_name: z.string().min(1),
  city: z.string().min(1),
  category: z.string().min(1)
});

export function createServer() {
  const server = new McpServer({
    name: 'beacon-mcp-server',
    version: '0.2.0'
  });

  server.registerTool(
    'audit_business',
    {
      title: 'Beacon Business Audit',
      description:
        'Run a Beacon AI visibility audit and return the VICCES benchmark structure.',
      inputSchema: auditInput
    },
    async ({ business_name, city, category }) => {
      const promptClusters = [
        {
          name: 'Visibility',
          weight: 0.2,
          prompts: [
            `What is ${business_name} in ${city}?`,
            `What businesses like ${business_name} are known in ${city}?`
          ]
        },
        {
          name: 'Intent',
          weight: 0.2,
          prompts: [
            `Who would you recommend for ${category} in ${city}?`,
            `What are the best ${category} businesses in ${city}?`
          ]
        },
        {
          name: 'Competition',
          weight: 0.15,
          prompts: [
            `Who are the main competitors to ${business_name} in ${city}?`,
            `Which ${category} businesses would you recommend instead of ${business_name}?`
          ]
        },
        {
          name: 'Current Demand',
          weight: 0.2,
          prompts: [
            `What are people looking for when they need ${category} in ${city}?`,
            `What are the highest-intent ${category} searches in ${city}?`
          ]
        },
        {
          name: 'Evidence',
          weight: 0.1,
          prompts: [
            `What publicly available sources support information about ${business_name}?`
          ]
        },
        {
          name: 'Strategic Gaps Covered',
          weight: 0.15,
          prompts: [
            `What strategic factors affect whether a ${category} business is recommended in ${city}?`
          ]
        }
      ];

      const result = {
        benchmark_version: '0.1.0',
        business: {
          name: business_name,
          city,
          category
        },
        prompt_clusters: promptClusters,
        vicces: {
          visibility: null,
          intent: null,
          competition: null,
          current_demand: null,
          evidence: null,
          strategic_gaps_covered: null,
          overall: null
        },
        status: 'prompt_matrix_ready',
        message:
          'Beacon audit structure generated. AI response collection and VICCES scoring are the next processing stages.'
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});