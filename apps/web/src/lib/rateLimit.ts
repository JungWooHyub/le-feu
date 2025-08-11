import { NextRequest } from 'next/server';

// In-memory rate limiting store (for production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

/**
 * Simple in-memory rate limiter
 * For production, this should be replaced with Redis or similar
 */
export function rateLimit({ windowMs, maxRequests }: RateLimitOptions) {
  return (request: NextRequest): { success: boolean; limit: number; remaining: number; resetTime: number } => {
    const now = Date.now();
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Clean up expired entries
    requestCounts.forEach((value, key) => {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    });
    
    const current = requestCounts.get(ip);
    
    if (!current || now > current.resetTime) {
      // First request or window has expired
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }
    
    if (current.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        resetTime: current.resetTime
      };
    }
    
    // Increment count
    current.count++;
    requestCounts.set(ip, current);
    
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    };
  };
}

// Pre-configured rate limiters
export const postRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // 10 posts per 15 minutes
});

export const likeRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30 // 30 likes per minute
});

export const commentRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20 // 20 comments per 5 minutes
});