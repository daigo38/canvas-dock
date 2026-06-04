import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type LogData = Record<string, unknown>;

const service = "canvas-dock";
const logDir = path.join(process.cwd(), "logs");
const appRetentionMs = 2 * 24 * 60 * 60 * 1000;
const appIdleRetentionMs = 24 * 60 * 60 * 1000;
const errorRetentionMs = 7 * 24 * 60 * 60 * 1000;

function shouldDelete(name: string, stat: fs.Stats, now: number): boolean {
  if (name.startsWith("app-")) {
    return now - stat.birthtimeMs > appRetentionMs || now - stat.mtimeMs > appIdleRetentionMs;
  }
  if (name.startsWith("error-")) {
    return now - stat.birthtimeMs > errorRetentionMs;
  }
  return false;
}

function cleanupLogs(): void {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    const now = Date.now();
    for (const name of fs.readdirSync(logDir)) {
      if (!/^(app|error)-\d{4}-\d{2}-\d{2}\.jsonl$/.test(name)) continue;
      const filePath = path.join(logDir, name);
      const stat = fs.statSync(filePath);
      if (shouldDelete(name, stat, now)) fs.rmSync(filePath, { force: true });
    }
  } catch {
    // Logging must never block route handling.
  }
}

function normalizeError(error: unknown): LogData {
  if (error instanceof Error) {
    return { error: error.message, stack: error.stack, errorName: error.name };
  }
  return { error: String(error) };
}

function write(level: LogLevel, message: string, data: LogData = {}): void {
  try {
    fs.mkdirSync(logDir, { recursive: true });
    const entry = {
      ts: new Date().toISOString(),
      level,
      service,
      message,
      ...data,
    };
    const line = `${JSON.stringify(entry)}\n`;
    const day = new Date().toISOString().slice(0, 10);
    fs.appendFileSync(path.join(logDir, `app-${day}.jsonl`), line);
    if (level === "error" || level === "fatal") {
      fs.appendFileSync(path.join(logDir, `error-${day}.jsonl`), line);
    }
  } catch {
    // Ignore logging failures.
  }
}

cleanupLogs();

export const logger = {
  debug: (message: string, data?: LogData) => write("debug", message, data),
  info: (message: string, data?: LogData) => write("info", message, data),
  warn: (message: string, data?: LogData) => write("warn", message, data),
  error: (message: string, error?: unknown, data?: LogData) =>
    write("error", message, { ...data, ...normalizeError(error) }),
  fatal: (message: string, error?: unknown, data?: LogData) =>
    write("fatal", message, { ...data, ...normalizeError(error) }),
};

export async function withApiLogging(
  req: NextRequest,
  route: string,
  handler: (requestId: string) => Promise<Response>,
): Promise<Response> {
  const startedAt = Date.now();
  const requestId = req.headers.get("x-request-id") ?? randomUUID();
  try {
    const res = await handler(requestId);
    try {
      res.headers.set("x-request-id", requestId);
    } catch {
      // Some SDK-generated responses may have immutable headers.
    }
    logger.info("HTTP request", {
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
      route,
      status: res.status,
      durationMs: Date.now() - startedAt,
    });
    return res;
  } catch (error) {
    logger.error("HTTP error", error, {
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
      route,
      durationMs: Date.now() - startedAt,
    });
    return Response.json({ error: "internal_error", requestId }, { status: 500 });
  }
}
