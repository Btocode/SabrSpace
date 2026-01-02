import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to extract and attach client IP address to the request
 * Handles various proxy headers and scenarios
 */
export function attachClientIP(req: Request, res: Response, next: NextFunction) {
  // Get IP from various headers, in order of preference
  const ip = getClientIP(req);

  // Attach to request object for use in routes
  (req as any).clientIP = ip;

  next();
}

/**
 * Extract client IP address from request, handling proxies
 */
export function getClientIP(req: Request): string {
  // Check various proxy headers in order of reliability
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  const trueClientIP = req.headers['true-client-ip'];

  // Handle comma-separated forwarded-for header (first IP is usually the original client)
  if (typeof forwardedFor === 'string') {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    if (ips.length > 0) {
      return ips[0];
    }
  }

  // Check other proxy headers
  if (typeof cfConnectingIP === 'string') {
    return cfConnectingIP;
  }

  if (typeof trueClientIP === 'string') {
    return trueClientIP;
  }

  if (typeof realIP === 'string') {
    return realIP;
  }

  // Fallback to connection remote address
  const remoteAddress = (req.connection as any)?.remoteAddress ||
                        (req.socket as any)?.remoteAddress ||
                        ((req.connection as any)?.socket?.remoteAddress);

  // Handle IPv4-mapped IPv6 addresses
  if (typeof remoteAddress === 'string') {
    // Remove IPv6 prefix for IPv4 addresses
    return remoteAddress.replace(/^::ffff:/, '');
  }

  // Final fallback
  return '127.0.0.1';
}
