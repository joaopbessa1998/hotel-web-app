/* src/types/express.d.ts */
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    role?: 'hospede' | 'hotel';
    userEmail?: string;
  }
}
