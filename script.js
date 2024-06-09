document.addEventListener('DOMContentLoaded', (event) => {
    loadGame();
    displaySavedResults();
});

function toggleSign(event) {
    const input = event.target.previousElementSibling;
    if (input && input.tagName === 'INPUT' && !input.disabled) {
        let value = parseInt(input.value) || 0;
        input.value = -value;
        updateTotals();
    }
}

function addPlayer() {
    let tableContainer = document.getElementById('tableContainer');
    let table = document.getElementById('playersTable');

    if (!table) {
        table = document.createElement('table');
        table.id = 'playersTable';
        
        const headerRow = document.createElement('tr');
        headerRow.id = 'headerRow';
        table.appendChild(headerRow);

        const footerRow = document.createElement('tr');
        footerRow.id = 'footerRow';
        table.appendChild(footerRow);

        tableContainer.appendChild(table);
    }

    const playerName = prompt("Enter player's name:");
    if (!playerName) {
        alert('Player name is required.');
        return;
    }

    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const playerCount = headerRow.children.length;

    if (playerCount < 10) {
        const newHeader = document.createElement('th');
        newHeader.textContent = playerName;
        headerRow.appendChild(newHeader);

        const newFooter = document.createElement('td');
        newFooter.textContent = '0';
        footerRow.appendChild(newFooter);

        const rows = document.querySelectorAll('#playersTable tr');
        rows.forEach(row => {
            if (row !== headerRow && row !== footerRow) {
                const newCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text'; // Changed to text to allow negative sign
                input.inputMode = 'numeric'; // Use numeric input mode to show numeric keypad
                input.value = '';
                input.addEventListener('input', updateTotals);
                input.addEventListener('input', allowOnlyNumbers);
                input.addEventListener('keydown', handleEnterKey);

                const toggleButton = document.createElement('button');
                toggleButton.className = 'toggle-sign';
                toggleButton.innerHTML = '±';
                toggleButton.addEventListener('click', toggleSign);

                newCell.appendChild(input);
                newCell.appendChild(toggleButton);
                row.appendChild(newCell);
            }
        });

        updateTotals();
        saveGame();
    } else {
        alert('Maximum number of players reached.');
    }
}

function removePlayer() {
    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const playerCount = headerRow ? headerRow.children.length : 0;

    if (playerCount > 0) {
        if (confirm("Are you sure you want to remove the last player?")) {
            headerRow.removeChild(headerRow.lastChild);
            footerRow.removeChild(footerRow.lastChild);

            const rows = document.querySelectorAll('#playersTable tr');
            rows.forEach(row => {
                if (row !== headerRow && row !== footerRow) {
                    row.removeChild(row.lastChild);
                }
            });

            updateTotals();
            saveGame();
        }
    } else {
        alert('At least one player is required.');
    }
}

function endGame() {
    const table = document.getElementById('playersTable');
    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const playerCount = headerRow ? headerRow.children.length : 0;

    if (playerCount === 0) {
        alert('No players to rank.');
        return;
    }

    const playerScores = [];

    for (let i = 0; i < playerCount; i++) {
        const playerName = headerRow.children[i].textContent.split(' ')[0]; // Get the original name without the rank
        const playerTotal = parseInt(footerRow.children[i].textContent.split(' ')[0]) || 0; // Get the total score without the rank
        playerScores.push({ name: playerName, score: playerTotal });
    }

    playerScores.sort((a, b) => b.score - a.score);

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'savedResults';
    const resultsList = document.createElement('ol');

    playerScores.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name}: ${player.score}`;
        resultsList.appendChild(listItem);
    });

    // Create a headline with the current date and time
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5); // Format HH:MM
    const headline = document.createElement('h2');
    headline.textContent = `Game Ended on ${dateStr} at ${timeStr}`;

    resultsContainer.appendChild(headline);
    resultsContainer.appendChild(resultsList);
    document.body.appendChild(resultsContainer);

    // Save the results to localStorage
    const previousResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    previousResults.push({
        date: dateStr,
        time: timeStr,
        results: playerScores
    });
    localStorage.setItem('gameResults', JSON.stringify(previousResults));

    alert('Game Ended!');
}

function newRound() {
    const table = document.getElementById('playersTable');
    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const playerCount = headerRow ? headerRow.children.length : 0;

    if (playerCount === 0) {
        alert('Please add players first.');
        return;
    }

    // Disable inputs and toggle buttons of all previous rounds
    const previousRounds = table.querySelectorAll('tr.round');
    previousRounds.forEach(round => {
        const inputs = round.querySelectorAll('input');
        const toggleButtons = round.querySelectorAll('.toggle-sign');
        inputs.forEach(input => {
            if (input.value === '') {
                input.value = '0';
            }
            input.setAttribute('disabled', 'true');
        });
        toggleButtons.forEach(button => {
            button.setAttribute('disabled', 'true');
        });
    });

    const newRow = document.createElement('tr');
    newRow.classList.add('round');

    for (let i = 0; i < playerCount; i++) {
        const newCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text'; // Changed to text to allow negative sign
        input.inputMode = 'numeric'; // Use numeric input mode to show numeric keypad
        input.value = '';
        input.addEventListener('input', updateTotals);
        input.addEventListener('input', allowOnlyNumbers);
        input.addEventListener('keydown', handleEnterKey);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-sign';
        toggleButton.innerHTML = '±';
        toggleButton.addEventListener('click', toggleSign);

        newCell.appendChild(input);
        newCell.appendChild(toggleButton);
        newRow.appendChild(newCell);
    }

    table.insertBefore(newRow, footerRow);
    updateTotals();
    saveGame();
}

function loadGame() {
    const data = JSON.parse(localStorage.getItem('gameData'));
    if (!data) return;

    let tableContainer = document.getElementById('tableContainer');
    let table = document.createElement('table');
    table.id = 'playersTable';

    tableContainer.appendChild(table);

    const headerRow = document.createElement('tr');
    headerRow.id = 'headerRow';
    table.appendChild(headerRow);

    const footerRow = document.createElement('tr');
    footerRow.id = 'footerRow';
    table.appendChild(footerRow);

    data.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        if (rowIndex > 0 && rowIndex < data.length - 1) {
            row.classList.add('round');
        }
        rowData.forEach((cellData, cellIndex) => {
            const cell = document.createElement('td');
            if (rowIndex === 0) {
                // Header row
                cell.textContent = cellData;
                headerRow.appendChild(cell);
            } else if (rowIndex === data.length - 1) {
                // Footer row
                cell.textContent = cellData;
                footerRow.appendChild(cell);
            } else {
                // Rounds
                if (typeof cellData === 'object') {
                    const input = document.createElement('input');
                    input.type = 'text'; // Changed to text to allow negative sign
                    input.inputMode = 'numeric'; // Use numeric input mode to show numeric keypad
                    input.value = cellData.value;
                    input.addEventListener('input', allowOnlyNumbers);
                    input.addEventListener('keydown', handleEnterKey);
                    if (cellData.disabled) {
                        input.setAttribute('disabled', 'true');
                    } else {
                        input.addEventListener('input', updateTotals);
                    }

                    const toggleButton = document.createElement('button');
                    toggleButton.className = 'toggle-sign';
                    toggleButton.innerHTML = '±';
                    toggleButton.addEventListener('click', toggleSign);
                    if (cellData.disabled) {
                        toggleButton.setAttribute('disabled', 'true');
                    }

                    cell.appendChild(input);
                    cell.appendChild(toggleButton);
                } else {
                    cell.textContent = cellData;
                }
                row.appendChild(cell);
            }
        });
        if (rowIndex !== 0 && rowIndex !== data.length - 1) {
            table.insertBefore(row, footerRow);
        }
    });

    updateTotals();
}

function updateTotals() {
    const table = document.getElementById('playersTable');
    const headerRow = document.getElementById('headerRow');
    const footerRow = document.getElementById('footerRow');
    const playerCount = headerRow ? headerRow.children.length : 0;
    const rows = table.getElementsByTagName('tr');

    const playerScores = [];

    for (let i = 0; i < playerCount; i++) {
        let total = 0;
        for (let j = 1; j < rows.length - 1; j++) { // Skip header row and footer row
            const cell = rows[j].children[i].firstChild;
            if (cell && cell.tagName === 'INPUT') {
                total += parseInt(cell.value) || 0;
            }
        }
        playerScores.push({ index: i, total: total });
        footerRow.children[i].textContent = total;
    }

    // Sort players by their scores in descending order
    playerScores.sort((a, b) => b.total - a.total);

    // Update scores with their current ranking
    playerScores.forEach((player, rank) => {
        const footerCell = footerRow.children[player.index];
        const score = player.total;
        footerCell.textContent = `${score} (${rank + 1})`;
    });

    saveGame();
}

function saveGame() {
    const table = document.getElementById('playersTable');
    if (!table) return;

    const rows = table.getElementsByTagName('tr');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].children;
        const row = [];
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j].firstChild;
            if (cell && cell.tagName === 'INPUT') {
                row.push({ value: cell.value, disabled: cell.disabled });
            } else {
                row.push(cells[j].textContent);
            }
        }
        data.push(row);
    }

    localStorage.setItem('gameData', JSON.stringify(data));
}

function resetGame() {
    if (confirm("Are you sure you want to reset the game?")) {
        localStorage.removeItem('gameData');
        document.getElementById('tableContainer').innerHTML = '';
    }
}

function allowOnlyNumbers(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9-]/g, '');
    // Ensure only one minus sign at the beginning
    if (input.value.indexOf('-') > 0) {
        input.value = input.value.replace(/-/g, '');
    }
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        const currentIndex = inputs.indexOf(event.target);
        
        if (inputs[currentIndex].value === '') {
            inputs[currentIndex].value = '0';
        }
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            inputs[currentIndex].blur(); // Remove focus from the last input
            newRound();
        }
        
        updateTotals();
    }
}

function displaySavedResults() {
    const savedResults = JSON.parse(localStorage.getItem('gameResults')) || [];
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'savedResults';

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