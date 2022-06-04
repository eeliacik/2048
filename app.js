document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const score = document.querySelector('.score');

  const squares = [];

  fillSquaresArray();
  generateNumber();
  generateNumber();
  fillBoard();

  function fillSquaresArray() {
    for (let i = 0; i < 16; i++) {
      squares.push(0);
    }
  };

  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      const square = document.createElement('div');
      square.className = 'game-square';
      square.innerHTML = squares[i];
      gameBoard.appendChild(square);
    }
  };

  // Random number generator
  function generateNumber() {
    let num = Math.floor(Math.random() * squares.length);
    if (squares[num] === 0) {
      squares[num] = 2;
    } else {
      generateNumber();
    }
  };

  // Move right
  // function moveRight() {
  //   const firstRow = [];
  //   const secondRow = [];
  //   for (let i = 0; i < 16; i++) {
  //   }
  // }
});
