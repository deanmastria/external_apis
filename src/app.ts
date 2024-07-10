import express from 'express';
import path from 'path';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Serve static files from the "public" and "dist" directories
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/search', async (req: express.Request, res: express.Response) => {
    const query = req.query.team as string;
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
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('API response error:', error.response.data);
                res.status(error.response.status).json({ message: `Request failed with status code ${error.response.status}: ${error.response.data.message}` });
            } else {
                console.error('Error:', error.message);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
