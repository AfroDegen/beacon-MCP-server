import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

import { getObservation } from './observer';

export function createServer() {
  const server = new McpServer({
    name: 'beacon-mcp-server',
    version: '0.2.0'
  });

  server.registerTool(
    'audit_business',
    {
      title: 'Audit Business',
      description:
        'Run a Beacon AI visibility audit for a business.',
      inputSchema: z.object({
        business_name: z.string().min(1),
        city: z.string().min(1),
        category: z.string().min(1)
      })
    },
    async ({ business_name, city, category }) => {

      const query =
        `${category} ${city}`;

      const observation =
        await getObservation(query);

      const result = {
        benchmark_version: '0.1.0',

        business: {
          business_name,
          city,
          category
        },

        observation,

        status: 'observation_ready',

        message:
          'Live search observation collected successfully.'
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

void serveStdio(createServer);
