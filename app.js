document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const score = document.querySelector('.score');

  let squares = Array(16).fill(0);

  generateNumber();
  generateNumber();
  fillBoard();

  function generateNumber() {
    let num = Math.floor(Math.random() * squares.length);
    squares[num] === 0 ? (squares[num] = 2) : generateNumber();
  }

  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      const square = document.createElement('div');
      square.className = 'game-square';
      square.innerHTML = squares[i];
      gameBoard.appendChild(square);
    }
  }

  // Horizontal and vertical moves
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


  // Move up
  function moveUp() {
    verticalMove();
    const orderedColumns = [];
    for (let i = 0; i < 4; i++) {
      const nums = [];
      const zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      const newColumn = nums.concat(zeros);
      orderedColumns.push(newColumn);
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const firstNum = orderedColumns[i][j];
        const secondNum = orderedColumns[i][j + 1];
        if (firstNum === secondNum) {
          orderedColumns[i][j] = firstNum + secondNum;
          orderedColumns[i][j + 1] = 0;
        } else if (firstNum === 0 && secondNum !== 0) {
          orderedColumns[i][j] = secondNum;
          orderedColumns[i][j + 1] = 0;
        }
      }
    }

    const mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        mergedSquares.push(orderedColumns[i][j]);
      }
    }
    squares = mergedSquares;
  }

  // Move direction controller
  function arrows(x) {
    if (x.keyCode === 38) {
      moveUp();
    }
  }
  
  document.addEventListener('keyup', arrows);
  
});
