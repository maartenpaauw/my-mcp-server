# UUID v7 MCP Server

A local Model Context Protocol (MCP) server that includes development utilities suited for my personal use.

## Features

- **Generate UUID v7**: Generate one or more time-ordered UUID v7 identifiers
- **Copy to Clipboard**: Copy any text to the system clipboard

## Installation

```bash
npm install
```

## Configuration

Add this server to your Claude Code MCP settings file:

```json
{
    "my-mcp-server": {
        "type": "stdio",
        "command": "node",
        "args": [
            "/Users/maartenpaauw/Personal/my-mcp-server/index.js"
        ],
        "env": {}
    }
}
```

After adding the configuration, restart Claude Code.
