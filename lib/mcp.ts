import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function getMCPClient() {
  return await createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("https://mcp-server-t2q8.onrender.com/mcp")
    ),
  });
}