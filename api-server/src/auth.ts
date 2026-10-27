import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

function getBearerToken(request: Request): string | null {
  const authorization = request.header('authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function tokensMatch(received: string, expected: string): boolean {
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return receivedBytes.length === expectedBytes.length && timingSafeEqual(receivedBytes, expectedBytes);
}

export function requireProspectsAuth(request: Request, response: Response, next: NextFunction): void {
  const expectedToken = process.env.PROSPECTS_ACCESS_TOKEN;
  const receivedToken = getBearerToken(request);

  if (!expectedToken || !receivedToken || !tokensMatch(receivedToken, expectedToken)) {
    response.status(401).set('WWW-Authenticate', 'Bearer').json({ error: 'Se requiere una credencial interna válida.' });
    return;
  }

  next();
}
