#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { v7 as uuidv7 } from "uuid";
import clipboardy from "clipboardy";

const server = new Server(
  {
    name: "my-mcp-server",
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
      {
        name: "copy_to_clipboard",
        description: "Copy text to the system clipboard.",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The text to copy to the clipboard",
            },
          },
          required: ["text"],
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

  if (request.params.name === "copy_to_clipboard") {
    const text = request.params.arguments?.text;

    if (!text) {
      throw new Error("Text parameter is required");
    }

    try {
      await clipboardy.write(text);

      return {
        content: [
          {
            type: "text",
            text: "Text copied to clipboard successfully",
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to copy to clipboard: ${error.message}`);
    }
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
