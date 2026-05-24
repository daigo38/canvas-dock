import { NextRequest } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { buildMcpServer } from "@/mcp/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stateless single-shot MCP: each request gets its own server + transport.
// Sufficient for tool calls and resource reads; not for long-lived sessions.
async function handle(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = buildMcpServer(origin);
  await server.connect(transport);
  const res = await transport.handleRequest(req as unknown as Request);
  return res;
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function DELETE(req: NextRequest) {
  return handle(req);
}
