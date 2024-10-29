import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

export default function authRoutes(app) {
  router.post('/register');
  router.post('/login');
  
  app.use('/api', authMiddleware); 
  app.get('/protected-route', authMiddleware, (req, res) => {
    // Your route handler
  });
  app.use('/auth', router);
}
