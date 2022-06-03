document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const score = document.querySelector('.score');
  const squares = [];

  createBoard();

  function createBoard() {
    for (let i = 0; i < 16; i++) {
      const square = document.createElement('div');
      square.className = 'game-square';
      square.innerHTML = 0;
      gameBoard.appendChild(square);
      squares.push(square);
    }
    generateNumber();
    generateNumber();
  }

  // Random number generator
  function generateNumber() {
    let num = Math.floor(Math.random() * squares.length);
    if (squares[num].innerHTML == 0) {
      squares[num].innerHTML = 2;
    } else {
      generateNumber();
    }
  }

  // Move right
  function moveRight() {
    for (let i = 0; i < 16; i++) {}
  }

});
