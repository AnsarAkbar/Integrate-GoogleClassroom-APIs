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

// Route to initiate OAuth flow
app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/classroom.courses',
            'https://www.googleapis.com/auth/userinfo.profile'
        ],
    });
    // console.log("url", url)
    res.redirect(url);
});

// Route to handle callback
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    // console.log('Authorization Code:', code);

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Exchange the authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Set the credentials for the OAuth2 client
        oauth2Client.setCredentials(tokens);

        req.session.tokens = tokens;
        // console.log('Session after saving tokens:', req.session.tokens);

        // Redirect the user to the frontend
        res.redirect('http://localhost:5173');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Route to create a course
app.post('/courses', async (req, res) => {
    console.log('Api hit')
    const tokens = req.session.tokens;

    console.log('token------------------------->', req.session)
    if (!tokens) {
        return res.status(401).send('User not authenticated');
    }
    // console.log('--->', tokens)

    // Set the credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens);
    try {
        // Fetch the authenticated user's profile
        const people = google.people({ version: 'v1', auth: oauth2Client });
        const profile = await people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses',
        });

        const ownerId = profile.data.resourceName.split('/')[1]; // Extract the user ID
        console.log("------ownerId-------", ownerId)

        // Create the course
        const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
        const course = {
            name: req.body.name,
            section: req.body.section,
            description: req.body.description,
            ownerId: ownerId, // Add the ownerId
        };
        const response = await classroom.courses.create({ requestBody: course });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Failed to create course');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});