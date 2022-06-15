document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const score = document.querySelector('.score');

  let squares = Array(16).fill(0);

  createRandomSquare();
  createRandomSquare();

  createBoard();

  function createRandomSquare() {
    if (squares.includes(0)) {
      let num = Math.floor(Math.random() * squares.length);
      squares[num] === 0 ? (squares[num] = 2) : createRandomSquare();
    } else return;
  }

  function createBoard() {
    for (let i = 0; i < 16; i++) {
      let square = document.createElement('div');
      square.className = 'game-square';
      square.id = 'sq-' + i;
      square.innerHTML = squares[i];
      gameBoard.appendChild(square);
    }
  }

  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      square.innerHTML = squares[i];
    }
  }

  // Horizontal and vertical moves
  let rows = [];
  let columns = [];
  // Creating operation arrays on horizantal move
  function horizontalMove() {
    const [firstRow, secondRow, thirdRow, fourthRow] = [[], [], [], []];
    const newRows = [];
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
    newRows.push(firstRow, secondRow, thirdRow, fourthRow);
    rows = newRows;
  }
  // Creating operation arrays on vertical move
  function verticalMove() {
    const [firstColumn, secondColumn, thirdColumn, fourthColumn] = [
      [],
      [],
      [],
      [],
    ];
    const newColumns = [];
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
    newColumns.push(firstColumn, secondColumn, thirdColumn, fourthColumn);
    columns = newColumns;
  }
  // Move up
  function moveUp() {
    verticalMove();
    let orderedColumns = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      let newColumn = nums.concat(zeros);
      orderedColumns.push(newColumn);
    }
    let mergedColumns = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        let firstNum = orderedColumns[i][j];
        let secondNum = orderedColumns[i][j + 1];
        if (firstNum === secondNum) {
          orderedColumns[i][j] = firstNum + secondNum;
          orderedColumns[i][j + 1] = 0;
        } else if (firstNum === 0 && secondNum !== 0) {
          orderedColumns[i][j] = secondNum;
          orderedColumns[i][j + 1] = 0;
        }
      }
      mergedColumns = orderedColumns;
    }

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][0]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][1]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][2]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][3]);
    }
    squares = mergedSquares;

    createRandomSquare();
    createRandomSquare();
    fillBoard();
  }
  // Move down
  function moveDown() {
    verticalMove();
    let orderedColumns = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        columns[i][j] ? nums.push(columns[i][j]) : zeros.push(columns[i][j]);
      }
      let newColumn = zeros.concat(nums);
      orderedColumns.push(newColumn);
    }
    let mergedColumns = [];
    for (let i = 3; i > -1; i--) {
      for (let j = 3; j > 1; j--) {
        let firstNum = orderedColumns[i][j];
        let secondNum = orderedColumns[i][j - 1];
        if (firstNum === secondNum) {
          orderedColumns[i][j] = firstNum + secondNum;
          orderedColumns[i][j - 1] = 0;
        } else if (firstNum === 0 && secondNum !== 0) {
          orderedColumns[i][j] = secondNum;
          orderedColumns[i][j - 1] = 0;
        }
      }
      mergedColumns = orderedColumns;
    }

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][0]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][1]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][2]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedColumns[i][3]);
    }
    squares = mergedSquares;
  }
  // Move right
  function moveRight() {
    horizontalMove();
    let orderedRows = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        rows[i][j] ? nums.push(rows[i][j]) : zeros.push(rows[i][j]);
      }
      let newRow = zeros.concat(nums);
      orderedRows.push(newRow);
    }
    let mergedRows = [];
    for (let i = 3; i > -1; i--) {
      for (let j = 3; j > 1; j--) {
        let firstNum = orderedRows[i][j];
        let secondNum = orderedRows[i][j - 1];
        if (firstNum === secondNum) {
          orderedRows[i][j] = firstNum + secondNum;
          orderedRows[i][j - 1] = 0;
        } else if (firstNum === 0 && secondNum !== 0) {
          orderedRows[i][j] = secondNum;
          orderedRows[i][j - 1] = 0;
        }
      }
      mergedRows = orderedRows;
    }

    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[i][0]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[i][1]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[i][2]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[i][3]);
    }
    squares = mergedSquares;
  }
  
  // Move direction controller
  function arrows(x) {
    if (x.keyCode === 38) {
      moveUp();
    } else if (x.keyCode === 40) {
      moveDown();
    } else if (x.keyCode === 37) {
      moveLeft();
    } else if (x.keyCode === 39) {
      moveRight();
    }
    createRandomSquare();
    createRandomSquare();
    fillBoard();
  }

  document.addEventListener('keyup', arrows);
  
});
