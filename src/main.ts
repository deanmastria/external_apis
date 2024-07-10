document.getElementById('searchForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const teamNameInput = document.getElementById('teamName') as HTMLInputElement | null;
    const resultDiv = document.getElementById('result') as HTMLElement | null;

    if (!teamNameInput || !resultDiv) {
        console.error('Required elements not found');
        return;
    }

    const teamName = teamNameInput.value;

    try {
        const response = await fetch(`/api/search?team=${teamName}`);
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <div class="col-md-6 mb-4">
                    <div class="card border-primary">
                        <div class="card-body">
                            <h2 class="card-title">Team: ${data.team.name}</h2>
                            <p class="card-text">Country: ${data.team.country}</p>
                            <p class="card-text">Founded: ${data.team.founded}</p>
                            <p class="card-text">Venue: ${data.venue.name} in ${data.venue.city}</p>
                            <p class="card-text">Capacity: ${data.venue.capacity}</p>
                            <img src="${data.team.logo}" alt="Team Logo" class="img-fluid" style="width:100px;height:100px;">
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card border-success">
                        <div class="card-body">
                            <h3 class="card-title">Statistics</h3>
                            <p class="card-text">Matches Played: ${data.statistics.fixtures.played.total}</p>
                            <p class="card-text">Wins: ${data.statistics.fixtures.wins.total}</p>
                            <p class="card-text">Draws: ${data.statistics.fixtures.draws.total}</p>
                            <p class="card-text">Losses: ${data.statistics.fixtures.loses.total}</p>
                            <p class="card-text">Goals For: ${data.statistics.goals.for.total.total}</p>
                            <p class="card-text">Goals Against: ${data.statistics.goals.against.total.total}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-danger w-100">${data.message}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger w-100">${(error as Error).message}</div>`;
    }
});
