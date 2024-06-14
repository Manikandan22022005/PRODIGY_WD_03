const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const playerSelection = document.getElementById('player-selection');
const modeSelection = document.getElementById('mode-selection');
const markerButtons = document.querySelectorAll('.marker-button');
const modeButtons = document.querySelectorAll('.mode-button');
let currentPlayer = '';
let userMarker = '';
let computerMarker = '';
let board = Array(9).fill(null);
let isGameOver = false;
let isSinglePlayer = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

modeButtons.forEach(button => button.addEventListener('click', selectMode));
markerButtons.forEach(button => button.addEventListener('click', selectMarker));

function selectMode(event) {
    const mode = event.target.getAttribute('data-mode');
    isSinglePlayer = mode === 'singleplayer';
    modeSelection.style.display = 'none';
    playerSelection.style.display = 'block';
}

function selectMarker(event) {
    userMarker = event.target.getAttribute('data-marker');
    computerMarker = userMarker === 'X' ? 'O' : 'X';
    currentPlayer = userMarker;
    playerSelection.style.display = 'none';
    document.querySelector('.game-board').style.display = 'grid';
    resetButton.style.display = 'block';
    message.textContent = `Player 1 is ${userMarker}.`;

    if (isSinglePlayer && computerMarker === 'X') {
        computerMove();
    }
}

function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] || isGameOver || !currentPlayer) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        message.textContent = `${currentPlayer} wins!`;
        strikeWinningCells();
        isGameOver = true;
    } else if (board.every(cell => cell !== null)) {
        message.textContent = 'Game tie!';
        isGameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isSinglePlayer && currentPlayer === computerMarker) {
            setTimeout(computerMove, 500);
        }
    }
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function strikeWinningCells() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => board[index] === currentPlayer)) {
            combination.forEach(index => {
                cells[index].style.position = 'relative';
                const line = document.createElement('div');
                line.id = 'winner-line';
                cells[index].appendChild(line);
            });
            const lineTransform = getTransform(combination);
            combination.forEach(index => {
                const line = cells[index].querySelector('#winner-line');
                line.style.width = 'calc(100% + 10px)';
                line.style.transform = lineTransform;
            });
        }
    });
}

function getTransform(combination) {
    const [a, b, c] = combination;
    if (a + 1 === b && b + 1 === c) return 'rotate(0deg)';
    if (a + 3 === b && b + 3 === c) return 'rotate(90deg)';
    if (a + 4 === b && b + 4 === c) return 'rotate(45deg)';
    if (a + 2 === b && b + 2 === c) return 'rotate(-45deg)';
}

function resetGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.innerHTML = '';
        cell.removeAttribute('style');
    });
    message.textContent = '';
    currentPlayer = '';
    userMarker = '';
    computerMarker = '';
    isGameOver = false;
    modeSelection.style.display = 'block';
    playerSelection.style.display = 'none';
    document.querySelector('.game-board').style.display = 'none';
    resetButton.style.display = 'none';
}

function computerMove() {
    let availableCells = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
    if (availableCells.length > 0) {
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = computerMarker;
        cells[randomIndex].textContent = computerMarker;
        if (checkWin(computerMarker)) {
            message.textContent = `${computerMarker} wins!`;
            currentPlayer = computerMarker;
            strikeWinningCells();
            isGameOver = true;
        } else if (board.every(cell => cell !== null)) {
            message.textContent = 'Game tie!';
            isGameOver = true;
        } else {
            currentPlayer = userMarker;
        }
    }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);