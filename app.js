document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const score = document.querySelector('.score');

  const squares = Array(16).fill(0);

  generateNumber();
  generateNumber();
  fillBoard();

  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      const square = document.createElement('div');
      square.className = 'game-square';
      square.innerHTML = squares[i];
      gameBoard.appendChild(square);
    }
  }

  // Random number generator
  function generateNumber() {
    let num = Math.floor(Math.random() * squares.length);
    squares[num] === 0 ? (squares[num] = 2) : generateNumber();
  }

  const rows = [];
  const columns = [];

  // Creating operation arrays on horizantal move
  function horizontalMove() {
    const [firstRow, secondRow, thirdRow, fourthRow] = [[], [], [], []];

    for (let i = 0; i < 16; i++) {
      if (i < 4) {
        firstRow.push(squares[i]);
      } else if (i < 8) {
        secondRow.push(squares[i]);
      } else if (i < 12) {
        thirdRow.push(squares[i]);
      } else {
        fourthRow.push(squares[i]);
      }
    }

    rows.push(firstRow, secondRow, thirdRow, fourthRow);
  }

  // Creating operation arrays on vertical move
  function verticalMove() {
    const [firstColumn, secondColumn, thirdColumn, fourthColumn] = [
      [],
      [],
      [],
      [],
    ];

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

    columns.push(firstColumn, secondColumn, thirdColumn, fourthColumn);
  }

  console.log('columns', columns);

  // Move up
  function moveUp() {
    verticalMove();
    const newOrder = [];
    for (let i = 0; i < 4; i++) {
      const nums = [];
      const zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      const newColumn = nums.concat(zeros);
      newOrder.push(newColumn);
    }
    console.log('new order:', newOrder);

    // for (let i = 0; i < 4; i++) {
    //   for (let j = 3; j > -1; j--) {
    //     const firstSquare = squares[i][j];
    //     const secondSquare = squares[i][j - 1];
    //     if (firstSquare !== 0 && firstSquare === secondSquare) {
    //       secondSquare = firstSquare + secondSquare;
    //       firstSquare = 0;
    //     } else return;
    //   }
    // }
  }

  moveUp();
});
