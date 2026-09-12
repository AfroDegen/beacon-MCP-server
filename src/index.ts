import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

export function createServer() {
  const server = new McpServer({
    name: 'beacon-mcp-server',
    version: '0.1.0'
  });

  server.registerTool(
    'audit_business',
    {
      title: 'Audit Business',
      description: 'Run a Beacon AI visibility audit for a business.',
      inputSchema: z.object({
        business_name: z.string().min(1),
        city: z.string().min(1),
        category: z.string().min(1)
      })
    },
    async ({ business_name, city, category }) => {
      const result = {
        business_name,
        city,
        category,
        status: 'ready',
        message: 'Beacon audit tool connected successfully.'
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