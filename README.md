# UUID v7 MCP Server

A local Model Context Protocol (MCP) server that includes development utilities suited for my personal use.

## Features

- Generate valid UUID v7.

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
