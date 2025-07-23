// Main auth package exports
// This file provides a unified export for both client and server functionality

// Types (shared)
export type * from './types';

// Note: Client and server exports should be imported separately to avoid bundling issues
// Use: import { ... } from '@repo/auth/client' for client-side
// Use: import { ... } from '@repo/auth/server' for server-side 