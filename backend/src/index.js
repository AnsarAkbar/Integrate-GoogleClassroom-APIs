import express from 'express';
import { google } from 'googleapis';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:4000/auth/google/callback'
);

app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day session timeout
    }
}));

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.courses',
];
app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.redirect(url);
  });
  
//   // Handle the callback from Google
  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send('Authorization code is missing');
    }
  
    try {
      // Exchange the authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Redirect the user to the frontend with the access token as a query parameter
      res.redirect(`http://localhost:5173?access_token=${tokens.access_token}`);
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      res.status(500).send('Authentication failed');
    }
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});