import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const client = new Client({
  name: 'beacon-test-client',
  version: '0.1.0'
});

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['tsx', 'src/index.ts']
});

await client.connect(transport);

const { tools } = await client.listTools();

if (!tools.some((tool) => tool.name === 'audit_business')) {
  throw new Error('audit_business tool was not registered');
}

const result = await client.callTool({
  name: 'audit_business',
  arguments: {
    business_name: 'Reedstar Royal Ltd',
    city: 'Lagos',
    category: 'SEO Services'
  }
});

console.log(JSON.stringify(result, null, 2));

await client.close();

console.log('Beacon MCP test passed.');