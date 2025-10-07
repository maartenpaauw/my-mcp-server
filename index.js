#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { v7 as uuidv7 } from "uuid";

const server = new Server(
  {
    name: "uuid-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_uuid_v7",
        description: "Generate one or more UUID v7 identifiers. UUID v7 is time-ordered and suitable for database keys and distributed systems.",
        inputSchema: {
          type: "object",
          properties: {
            count: {
              type: "number",
              description: "Number of UUIDs to generate (default: 1, max: 100)",
              minimum: 1,
              maximum: 100,
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "generate_uuid_v7") {
    const count = Math.min(Math.max(request.params.arguments?.count || 1, 1), 100);
    const uuids = Array.from({ length: count }, () => uuidv7());

    return {
      content: [
        {
          type: "text",
          text: count === 1
            ? uuids[0]
            : uuids.join("\n"),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
