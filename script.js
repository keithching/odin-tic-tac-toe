// a module pattern with IIFE
const gameBoard = (() => {
    // initialize an empty array
    let array = [
                    ['','',''],
                    ['','',''],
                    ['','','']
                ];

    // spread the array into the DOM, and set data attributes
    const renderContent = () => {
        const squares = document.querySelectorAll('.square');
        let k = 0;

        for (let i = 0; i < gameBoard.array.length; i++) {
            for (let j = 0; j < gameBoard.array[i].length; j++) {
                squares[k].textContent = gameBoard.array[i][j];
                squares[k].setAttribute('data-row', i);
                squares[k].setAttribute('data-col', j);
                k++;
            }
        }
    }

    const clearArray = () => {
        gameBoard.array = gameBoard.array.map(index => index.map(value => ''));
        gameBoard.winningMovesArray = gameBoard.winningMovesArray.map(index => index.map(value => ''));
    }
    
    // logic for adding move onto the game board
    const addMove = (currentTurn, square) => {
        if (gameBoard.array[square.getAttribute('data-row')][square.getAttribute('data-col')] == '' && !gameController.gameEnded) {
            if (currentTurn == 'player1') { 
                gameBoard.array[square.getAttribute('data-row')][square.getAttribute('data-col')] = player1.getSelection();
                square.textContent = player1.getSelection();
                player1.moves.push(square);
            } else if (currentTurn == 'player2') {
                gameBoard.array[square.getAttribute('data-row')][square.getAttribute('data-col')] = player2.getSelection();
                square.textContent = player2.getSelection();
                player2.moves.push(square);
            }
        }
    }

    // amend to the winning moves array if the game has been decided as per checkResult function
    let winningMovesArray = [
                                ['','',''],
                                ['','',''],
                                ['','','']
                            ];

    const checkResult = () => {

        // check horizontally 
        for (let i = 0; i < gameBoard.array.length; i++) {
            if (gameBoard.array[i].every(currentMarker => currentMarker == 'O')) {
                gameBoard.winningMovesArray[i] = gameBoard.array[i];
                return 'O';
            }
            else if (gameBoard.array[i].every(currentMarker => currentMarker == 'X')) {
                gameBoard.winningMovesArray[i] = gameBoard.array[i];
                return 'X';
            }
        }

        // check vertically (by transposing the original 2D array)
        // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript credit to Mahdi Jadaliha
        let transposedArray = gameBoard.array[0].map((x, i) => gameBoard.array.map(x => x[i]));
        for (let i = 0; i < transposedArray.length; i++) {
            if (transposedArray[i].every(currentMarker => currentMarker == 'O')) {
                gameBoard.winningMovesArray[i] = transposedArray[i];
                gameBoard.winningMovesArray = gameBoard.winningMovesArray[0].map((x, i) => gameBoard.winningMovesArray.map(x => x[i]));
                return 'O';
            }
            else if (transposedArray[i].every(currentMarker => currentMarker == 'X')) {
                gameBoard.winningMovesArray[i] = transposedArray[i];
                gameBoard.winningMovesArray = gameBoard.winningMovesArray[0].map((x, i) => gameBoard.winningMovesArray.map(x => x[i]));
                return 'X';
            }
        }

        // check diagonally 1 (backward slash direction)
        let backwardDiagonalArray = [];
        for (let i = 0; i < gameBoard.array[0].length; i++) {
            backwardDiagonalArray.push(gameBoard.array[i][i]);
        }
        if (backwardDiagonalArray.every(currentMarker => currentMarker == 'O')) {
            for (let i = 0; i < gameBoard.array[0].length; i++) {
                gameBoard.winningMovesArray[i][i] = backwardDiagonalArray[i];
            }
            return 'O';
        }
        else if (backwardDiagonalArray.every(currentMarker => currentMarker == 'X')) {
            for (let i = 0; i < gameBoard.array[0].length; i++) {
                gameBoard.winningMovesArray[i][i] = backwardDiagonalArray[i];
            }
            return 'X';
        }

        // check diagonally 2 (forward slash direction)
        let forwardDiagonalArray = [];
        for (let i = 0; i < gameBoard.array[0].length; i++) {
            forwardDiagonalArray.push(gameBoard.array[i][gameBoard.array[0].length - i - 1]);
        }     
        if (forwardDiagonalArray.every(currentMarker => currentMarker == 'O')) {
            for (let i = 0; i < gameBoard.array[0].length; i++) {
                gameBoard.winningMovesArray[i][gameBoard.array[0].length - i - 1] = forwardDiagonalArray[i];
            }
            return 'O';
        }
        else if (forwardDiagonalArray.every(currentMarker => currentMarker == 'X')) {
            for (let i = 0; i < gameBoard.array[0].length; i++) {
                gameBoard.winningMovesArray[i][gameBoard.array[0].length - i - 1] = forwardDiagonalArray[i];
            }
            return 'X';
        }

        // tie the game if entire array is filled with non-empty string
        if (gameBoard.array.every(currentIndex => currentIndex.every(value => value != '')))
        {
            return 'tie';
        }

        return 'onging';
    }

    return {array, renderContent, clearArray, addMove, checkResult, winningMovesArray};
})();


// player factory function
const Player = (selection, name) => {
    const getSelection = () => selection;
    const playerName = name || 'dafault';
    const getName = () => playerName;

    return {getSelection, getName};
}


// module for controlling the flow of game
const gameController = (() => {

    const playerCreation = () => {

        const noughtBtn = document.querySelector('#nought');
        const crossBtn = document.querySelector('#cross');
        noughtBtn.disabled = false;
        crossBtn.disabled = false;

        noughtBtn.addEventListener('click', () => {
            player1 = Player('O', document.querySelector('#noughtPlayerNameInput').value);
            player2 = Player('X', document.querySelector('#crossPlayerNameInput').value);
            noughtBtn.classList.add('goingFirst');
            crossBtn.classList.remove('goingFirst');
            startAndRestartBtn.disabled = false;
        });

        crossBtn.addEventListener('click', () => {
            player1 = Player('X', document.querySelector('#crossPlayerNameInput').value);
            player2 = Player('O', document.querySelector('#noughtPlayerNameInput').value);
            crossBtn.classList.add('goingFirst');
            noughtBtn.classList.remove('goingFirst');
            startAndRestartBtn.disabled = false;
        });

    }

    let gameStarted = false;

    const startGame = () => {

        gameController.gameStarted = true;

        document.querySelector('#nought').classList.remove('goingFirst');
        document.querySelector('#cross').classList.remove('goingFirst');
        document.querySelector('#nought').disabled = true;
        document.querySelector('#cross').disabled = true;

        if (player1.getSelection() == 'O') {
            player1 = Player('O', document.querySelector('#noughtPlayerNameInput').value);
            player2 = Player('X', document.querySelector('#crossPlayerNameInput').value);
            document.querySelector('#noughtPlayerNameInput').remove();
            document.querySelector('#crossPlayerNameInput').remove();
            document.querySelector('#noughtPlayer').textContent = player1.getName();
            document.querySelector('#noughtPlayer').classList.add('creation');
            document.querySelector('#crossPlayer').textContent = player2.getName();
            document.querySelector('#crossPlayer').classList.add('creation');
        } else if (player1.getSelection() == 'X') {
            player1 = Player('X', document.querySelector('#crossPlayerNameInput').value);
            player2 = Player('O', document.querySelector('#noughtPlayerNameInput').value);
            document.querySelector('#noughtPlayerNameInput').remove();
            document.querySelector('#crossPlayerNameInput').remove();
            document.querySelector('#noughtPlayer').textContent = player2.getName();
            document.querySelector('#noughtPlayer').classList.add('creation');
            document.querySelector('#crossPlayer').textContent = player1.getName();
            document.querySelector('#crossPlayer').classList.add('creation');
        }

        // initialize hover effect on the gameBoard
        document.querySelectorAll('.square').forEach(square => square.classList.add('gameStarted'));

        // emphasize current turn player
        currentTurnMessage();

        startAndRestartBtn.textContent = 'Restart';

        // event listener on the gameboard
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {

            square.addEventListener('click', () => {

            // logic for adding a move
            gameBoard.addMove(gameController.currentTurn, square);

            // check result after every made move
            let result = gameBoard.checkResult();

            if (result == player1.getSelection()) {
                gameController.endGameMessage = `${player1.getSelection()} wins!`;
                gameController.endGame();
                gameController.showWinningMoves();
            } else if (result == player2.getSelection()) {
                gameController.endGameMessage = `${player2.getSelection()} wins!`;
                gameController.endGame();
                gameController.showWinningMoves();
            }
            else if (result == 'tie') {
                gameController.endGameMessage = 'tie game';
                gameController.endGame();                
            }
            else {
                // game continue to next turn
                gameController.currentTurn = gameController.nextTurn();
                gameController.currentTurnMessage();
            }

            });
        });
    }

    // by default
    let currentTurn = 'player1';

    const nextTurn = () => {
        if (gameController.currentTurn == 'player1') {
            return 'player2';
        } else if (gameController.currentTurn == 'player2') {
            return 'player1';
        }
    }

    const currentTurnMessage = () => {
        if (gameController.currentTurn == 'player1') {
            if (player1.getSelection() == 'O') {
                document.querySelector('#noughtPlayer').classList.add('currentTurn');
                document.querySelector('#crossPlayer').classList.remove('currentTurn');
            } else if (player1.getSelection() == 'X') {
                document.querySelector('#crossPlayer').classList.add('currentTurn');
                document.querySelector('#noughtPlayer').classList.remove('currentTurn');
            }
        } else if (gameController.currentTurn == 'player2') {
            if (player2.getSelection() == 'O') {
                document.querySelector('#noughtPlayer').classList.add('currentTurn');
                document.querySelector('#crossPlayer').classList.remove('currentTurn');
            } else if (player2.getSelection() == 'X') {
                document.querySelector('#crossPlayer').classList.add('currentTurn');
                document.querySelector('#noughtPlayer').classList.remove('currentTurn');
            }           
        } 
    }

    let gameEnded = false;
    let endGameMessage;
    const endGameMessageDOM = document.querySelector('#endGameMessage');

    const endGame = () => {
        gameController.gameEnded = true;
        endGameMessageDOM.textContent = gameController.endGameMessage;
        document.querySelectorAll('.square').forEach(square => square.classList.remove('gameStarted'));
    }

    const restartGame = () => {
        // reset game board
        gameBoard.clearArray();
        gameBoard.renderContent();

        // reset players' moves
        player1.moves = [];
        player2.moves = [];

        // reset game states
        gameController.gameEnded = false;
        endGameMessageDOM.textContent = '';
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('win');
            square.classList.add('gameStarted');
        });
    }

    const showWinningMoves = () => {
        // get the DOM elements
        for (let i = 0; i < gameBoard.winningMovesArray.length; i++) {
            for (let j = 0; j < gameBoard.winningMovesArray[i].length; j++) {
                    document.querySelectorAll('.square').forEach(square => {
                        if (gameBoard.winningMovesArray[i][j] != '' && square.getAttribute('data-row') == i && square.getAttribute('data-col') == j) {
                            square.classList.add('win');
                        }
                });

            }
        }
    }

    return {playerCreation, startGame, currentTurn, nextTurn, currentTurnMessage, gameStarted, gameEnded, endGame, endGameMessage, restartGame, showWinningMoves};
})();


// Global Codes Below

// initialize the game board
gameBoard.renderContent();

// global variables
let player1;
let player2;

// player creation
gameController.playerCreation();

const startAndRestartBtn = document.querySelector('#startAndRestart');
startAndRestartBtn.disabled = true;
startAndRestartBtn.addEventListener('click', () => {
    if (!gameController.gameStarted) {
        gameController.startGame();
    } else if (gameController.gameStarted) {
        gameController.restartGame();
    }
});