// rate-limiter-middleware.ts
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window (15 minutes)
  // Other options (e.g., custom messages, status codes) can be configured here
});

export default limiter;
