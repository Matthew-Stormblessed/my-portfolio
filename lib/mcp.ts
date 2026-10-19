import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function getMCPClient() {
  return await createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("https://mcp-server-t2q8.onrender.com/mcp")
    ),
    // Allow nearly one minute for a sleeping Render free service while retaining a little time under Netlify's 60-second stream limit.
    initializationOptions: { timeout: 55_000, maxTotalTimeout: 55_000 },
  });
}
