const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

// CORS configuration options
const corsOptions = {
    origin: '*', // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Home route to render the static HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route to handle form submission and fetch data from the API
app.post('/search', async (req, res) => {
    const query = req.body.query;
    const apiKey = 'YOUR_RAPIDAPI_KEY';
    const apiHost = 'api-football-v1.p.rapidapi.com';
    const apiUrl = `https://${apiHost}/v3/teams?name=${query}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
            },
        });
        const teamData = response.data.response[0]; // Assuming the first result is the most relevant
        res.render('result', { team: teamData });
    } catch (error) {
        console.log(error.response.data); // Log detailed error response
        res.render('error', { message: `Request failed with status code ${error.response.status}` });
    }
});

// Listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
