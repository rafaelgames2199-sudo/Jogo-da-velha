

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let timerSeconds = 0;
let timerInterval;
let scores = { X: 0, O: 0 };
let photoX = null;
let photoO = null;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

function startTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    timerInterval = setInterval(() => {
        timerSeconds++;
        let mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        let secs = (timerSeconds % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${mins}:${secs}`;
    }, 1000);
}

function handleCellClick(e) {
    const cell = e.target.closest('.cell');
    const index = cell.getAttribute('data-index');

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    
    if (currentPlayer === "X") {
        cell.innerHTML = photoX ? `<img src="${photoX}">` : "X";
        cell.style.color = "var(--accent-x)";
    } else {
        cell.innerHTML = photoO ? `<img src="${photoO}">` : "O";
        cell.style.color = "var(--accent-o)";
    }

    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let condition of winConditions) {
        let a = board[condition[0]];
        let b = board[condition[1]];
        let c = board[condition[2]];
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        const winnerName = currentPlayer === "X" ? document.getElementById('p1-name').value : document.getElementById('p2-name').value;
        alert(`Fim de jogo! ${winnerName} venceu!`);
        scores[currentPlayer]++;
        updateUI();
        gameActive = false;
        clearInterval(timerInterval);
        return;
    }

    if (!board.includes("")) {
        alert("Empate!");
        gameActive = false;
        clearInterval(timerInterval);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const nextName = currentPlayer === "X" ? document.getElementById('p1-name').value : document.getElementById('p2-name').value;
    document.getElementById('turn-text').textContent = `Vez de: ${nextName}`;
}

function updateUI() {
    document.getElementById('score-display').textContent = `${scores.X} - ${scores.O}`;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.style.color = "white";
    });
    const p1 = document.getElementById('p1-name').value;
    document.getElementById('turn-text').textContent = `Vez de: ${p1}`;
    startTimer();
    updateUI();
}

// Lógica para carregar fotos
document.getElementById('p1-file').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => photoX = event.target.result;
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

document.getElementById('p2-file').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => photoO = event.target.result;
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// Event Listeners
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

// Início automático do timer ao abrir a página
startTimer();
