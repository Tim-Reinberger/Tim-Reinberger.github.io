document.addEventListener('DOMContentLoaded', (event) => {
    displaySavedResults();
	displayWinStats();
});


function displayWinStats() {
    const winStatsDiv = document.getElementById('winStats');
    if (!winStatsDiv) return;

    const savedResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const winCounts = {};

    // Calculate win counts for each player
    savedResults.forEach(result => {
        let highestScore = -Infinity;
        let winners = [];

        result.results.forEach(player => {
            if (!winCounts[player.name]) {
                winCounts[player.name] = 0;
            }
            if (player.score > highestScore) {
                highestScore = player.score;
                winners = [player.name];
            } else if (player.score === highestScore) {
                winners.push(player.name);
            }
        });

        // Increment win count for all winners
        winners.forEach(winner => {
            winCounts[winner] += 1;
        });
    });

    // Convert winCounts object to an array of [name, wins] pairs
    const sortedWinCounts = Object.entries(winCounts).sort((a, b) => b[1] - a[1]);

    // Create a list of win counts
    const winList = document.createElement('ol');
    sortedWinCounts.forEach(([player, wins]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player}: ${wins} wins`;
        winList.appendChild(listItem);
    });

    winStatsDiv.appendChild(winList);
}



// Existing function for displaying saved results
function displaySavedResults() {
    const savedResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const resultsContainer = document.getElementById('resultsContainer');

    savedResults.forEach(result => {
        const headline = document.createElement('h2');
        headline.textContent = `Game Ended on ${result.date} at ${result.time}`;

        const resultsList = document.createElement('ol');
        result.results.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = `${player.name}: ${player.score}`;
            resultsList.appendChild(listItem);
        });

        resultsContainer.appendChild(headline);
        resultsContainer.appendChild(resultsList);
    });

    document.body.appendChild(resultsContainer);
}

function resetGameStats() {
	if (confirm("Bist du sicher, dass du die Tablle zurücksetzen willst?")) {
        localStorage.removeItem('gameResults');
        document.getElementById('tableContainer').innerHTML = '';
		location.reload();
		}

}