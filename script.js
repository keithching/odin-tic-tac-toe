// a module pattern
const gameBoard = (() => {
    // initialize an empty array
    const array = [
                    ['','',''],
                    ['','',''],
                    ['','','']
                ];
    // spread the array into the DOM, and set data attributes
    const renderContent = () => {
        const squares = document.querySelectorAll('.square');
        let k = 0;

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                squares[k].textContent = array[i][j];
                squares[k].setAttribute('data-row', i);
                squares[k].setAttribute('data-col', j);
                k++;
            }
        }
    }
    // logic for adding move onto the game board
    const addMove = (currentTurn, square) => {
        if (array[square.getAttribute('data-row')][square.getAttribute('data-col')] == '' && !gameBoard.endGame) {
            if (currentTurn == 'player1') { 
                array[square.getAttribute('data-row')][square.getAttribute('data-col')] = player1.getSelection();
                square.textContent = player1.getSelection();
                player1.moves.push(square);
            } else if (currentTurn == 'player2') {
                array[square.getAttribute('data-row')][square.getAttribute('data-col')] = player2.getSelection();
                square.textContent = player2.getSelection();
                player2.moves.push(square);
            }
            displayController.currentTurn = displayController.nextTurn(displayController.currentTurn);
            message.textContent = `current turn is ${displayController.currentTurn}. next turn is ${displayController.nextTurn(displayController.currentTurn)}`;
        }
    }

    const checkResult = () => {
        // check horizontally 
        for (let i = 0; i < array.length; i++) {
            if (array[i].every(currentMarker => currentMarker == 'O')) {
                return 'O';
            }
            else if (array[i].every(currentMarker => currentMarker == 'X')) {
                return 'X';
            }
        }
        // check vertically (by transposing the original 2D array)
        // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript credit to Mahdi Jadaliha
        let transposedArray = array[0].map((x, i) => array.map(x => x[i]));
        for (let i = 0; i < transposedArray.length; i++) {
            if (transposedArray[i].every(currentMarker => currentMarker == 'O')) {
                return 'O';
            }
            else if (transposedArray[i].every(currentMarker => currentMarker == 'X')) {
                return 'X';
            }
        }
        // check diagonally 1 (backward slash direction)
        let backwardDiagonalArray = [];
        for (let i = 0; i < array[0].length; i++) {
            backwardDiagonalArray.push(array[i][i]);
        }
        if (backwardDiagonalArray.every(currentMarker => currentMarker == 'O')) {
            return 'O';
        }
        else if (backwardDiagonalArray.every(currentMarker => currentMarker == 'X')) {
            return 'X';
        }
        // check diagonally 2 (forward slash direction)
        let forwardDiagonalArray = [];
        for (let i = 0; i < array[0].length; i++) {
            forwardDiagonalArray.push(array[i][array[0].length - i - 1]);
        }     
        if (forwardDiagonalArray.every(currentMarker => currentMarker == 'O')) {
            return 'O';
        }
        else if (forwardDiagonalArray.every(currentMarker => currentMarker == 'X')) {
            return 'X';
        }

        return 'onging';
    }

    let endGame = false;

    return {array, renderContent, addMove, checkResult, endGame};
})();


// module for controlling flow of game
const displayController = (() => {
    // let currentTurn = 'player1';
    let currentTurn = 'player1';
    const nextTurn = (currentTurn) => {
        if (currentTurn == 'player1') {
            return 'player2';

        } else if (currentTurn == 'player2') {
            return 'player1';
        }
    }

    return {currentTurn, nextTurn};
})();


// player factory function
const Player = (selection) => {
    const getSelection = () => selection;
    let isWinner = false;
    const moves = [];

    return {getSelection, isWinner, moves};
}

let player1;
let player2;

const noughtBtn = document.querySelector('#nought');
const crossBtn = document.querySelector('#cross');

noughtBtn.addEventListener('click', () => {
    player1 = Player('O');
    player2 = Player('X');
    noughtBtn.disabled = true;
    crossBtn.disabled = true;
    document.querySelector('#selection').textContent = `player1 selected ${player1.getSelection()}, player2 selected ${player2.getSelection()}`;
})

crossBtn.addEventListener('click', () => {
    player1 = Player('X');
    player2 = Player('O');
    noughtBtn.disabled = true;
    crossBtn.disabled = true;
    document.querySelector('#selection').textContent = `player1 selected ${player1.getSelection()}, player2 selected ${player2.getSelection()}`;
})


const message = document.querySelector('#turn');
message.textContent = `current turn is ${displayController.currentTurn}. next turn is ${displayController.nextTurn(displayController.currentTurn)}`;

// event listener on the gameboard
const squares = document.querySelectorAll('.square');
squares.forEach(square => {

    square.addEventListener('click', () => {
    gameBoard.addMove(displayController.currentTurn, square);
    if (gameBoard.checkResult() == player1.getSelection()) {
        player1.isWinner = true;
        player1.moves.forEach(square => square.classList.add('win'));
        gameBoard.endGame = true;
        // console.log(`${player1.getSelection()} wins!`);
    } else if (gameBoard.checkResult() == player2.getSelection()) {
        player2.isWinner = true;
        player2.moves.forEach(square => square.classList.add('win'));
        gameBoard.endGame = true;
        // console.log(`${player2.getSelection()} wins!`);
    }
    });

    // // TESING
    // square.addEventListener('mouseover', () => {
    //     if (displayController.currentTurn == 'player1') { 
    //         square.textContent = player1.getSelection();
    //     } else if (displayController.currentTurn == 'player2') {
    //         square.textContent = player2.getSelection();
    //     }
    // });
    // // TESING
    // square.addEventListener('mouseout', () => {
    //     if (displayController.currentTurn == 'player1') { 
    //         square.textContent = '';
    //     } else if (displayController.currentTurn == 'player2') {
    //         square.textContent = '';
    //     }
    // });

});


// initialize the game board
gameBoard.renderContent();