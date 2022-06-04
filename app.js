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

  // Creating operaiton arrays on horizantal move
  function horizontalMove() {
    const firstRow = [];
    const secondRow = [];
    const thirdRow = [];
    const fourthRow = [];
    for (let i = 0; i < 16; i++) {
      if (i < 4) {
        firstRow.push(squares[i]);
      } else if (3 < i < 8) {
        secondRow.push(squares[i]);
      } else if (7 < i < 12) {
        thirdRow.push(squares[i]);
      } else {
        fourthRow.push(squares[i]);
      }
    }
  };
  
  // Creating operaiton arrays on vertical move
  function verticalMove() {
    const firstColumn = [];
    const secondColumn = [];
    const thirdColumn = [];
    const fourthColumn = [];
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        firstColumn.push(squares[i]);
      } else if (i % 4 === 1) {
        secondColumn.push(squares[i]);
      } else if (i % 4 === 2) {
        thirdColumn.push(squares[i]);
      } else {
        fourthColumn.push(squares[i]);
      }
    }
  };

  // Move up
  function moveUp() {
    
  }


});
