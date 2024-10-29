import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OAuth2Server from 'oauth2-server';
import authRoutes from './routes/auth.js';
import helmet from "helmet";
import oauthModel from './models/oauthModel.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up OAuth server
const oauth = new OAuth2Server({
  model: oauthModel,
  accessTokenLifetime: 60 * 60,
  allowBearerTokensInQueryString: true
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection failed:', error));

// Add middleware to obtain token
const obtainToken = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(err.code || 500).json(err);
  }
};

// Add route to obtain token
app.post('/auth/oauth/token', obtainToken);

// Pass app instance to authRoutes
authRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
