import { Request } from 'express';
import 'express';

// declare module 'express-serve-static-core' {
//   interface Request {
//     userId?: string;
//     role?: 'hospede' | 'hotel' | string;
//     userEmail?: string;
//   }
// }
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: 'hospede' | 'hotel' | string;
      userEmail?: string;
    }
  }
}
