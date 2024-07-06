// app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};


app.use(cors(corsOptions));


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }));


app.get('/api/search', async (req, res) => {
    const query = req.query.team;
    const apiKey = '56b74a6e54mshc938c03c3a37700p17e7b7jsnc74ba108eefd'; 
    const apiHost = 'api-football-v1.p.rapidapi.com';
    const searchUrl = `https://${apiHost}/v3/teams?search=${query}`;

    console.log(`Fetching data for team: ${query}`);

    try {
        const searchResponse = await axios.get(searchUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost,
            },
        });

        if (searchResponse.data.response.length === 0) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const teamId = searchResponse.data.response[0].team.id;
        const statisticsUrl = `https://${apiHost}/v3/teams/statistics?league=39&season=2023&team=${teamId}`;
        const statsResponse = await axios.get(statisticsUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost,
            },
        });

        const teamData = {
            team: searchResponse.data.response[0].team,
            venue: searchResponse.data.response[0].venue,
            statistics: statsResponse.data.response
        };

        res.json(teamData);
    } catch (error) {
        if (error.response) {
            console.error('API response error:', error.response.data);
            res.status(error.response.status).json({ message: `Request failed with status code ${error.response.status}: ${error.response.data.message}` });
        } else {
            console.error('Error:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
