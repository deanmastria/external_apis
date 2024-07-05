document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const teamName = document.getElementById('teamName').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch(`/api/search?team=${teamName}`);
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <h2>Team: ${data.team.name}</h2>
                <p>Country: ${data.team.country}</p>
                <p>Founded: ${data.team.founded}</p>
                <p>Venue: ${data.venue.name} in ${data.venue.city}</p>
                <p>Capacity: ${data.venue.capacity}</p>
                <img src="${data.team.logo}" alt="Team Logo" style="width:100px;height:100px;">
            `;
        } else {
            resultDiv.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
