document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const newGameEl = document.querySelector('.new-game-button');
  newGameEl.addEventListener('click', resetGame);
  const gameScoreEl = document.getElementById('game-score');
  const highScoreEl = document.getElementById('high-score');

  let squares = [];
  let gameScore = 0;
  let highScore = 0;

  let rows = [];
  let columns = [];

  fillSquares();
  createBoard();
  lastMoveControl();

  function fillSquares() {
    let emptySquares = Array(16).fill(0);
    squares = emptySquares;
  }
  function fillRandomSquare() {
    if (squares.includes(0)) {
      let num = Math.floor(Math.random() * squares.length);
      let twoOrFour = Math.random() > 0.1 ? 2 : 4;
      squares[num] === 0 ? (squares[num] = twoOrFour) : fillRandomSquare();
    } else return;
  }
  function createBoard() {
    fillRandomSquare();
    fillRandomSquare();
    for (let i = 0; i < 16; i++) {
      let square = document.createElement('div');
      square.className = 'game-square';
      square.id = 'sq-' + i;
      square.innerHTML = squares[i];
      gameBoard.appendChild(square);
    }
  }
  function fillGameScore() {
    gameScoreEl.innerHTML = gameScore;
  }
  function fillBoard() {
    fillGameScore();
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      square.innerHTML = squares[i];
    }
  }
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
  function noMoveControl(current, previous) {
    return current.every((num, index) => num === previous[index]);
  }
  function lastMoveControl() {
    horizontalMove();
    verticalMove();
    let checkedRowSquares = 0;
    let checkedColumnSquares = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (rows[i][j] === rows[i][j + 1]) {
          checkedRowSquares++;
        }
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (columns[i][j] === columns[i][j + 1]) {
            checkedColumnSquares++;
          }
        }
      }
    }
    if (checkedRowSquares + checkedColumnSquares < 1 && !squares.includes(0)) {
      gameOver();
    } else if (squares.includes(2048)) {
      gameWin();
    }
  }
  // Win
  function gameWin() {
    console.log('YOU WIN!');
  }
  // Game over
  function gameOver() {
    console.log('GAME OVER');
  }
  // Reset game
  function resetGame() {
    gameScore = 0;
    fillSquares();
    fillRandomSquare();
    fillRandomSquare();
    fillBoard();
  }
  // Move direction controller
  document.addEventListener('keyup', arrows);
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
    fillBoard();
  }
  // Move up
  function moveUp() {
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
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        moveScore += orderedColumns[i][0] + orderedColumns[i][2];
        orderedColumns[i][0] *= 2;
        orderedColumns[i][1] = orderedColumns[i][2] * 2;
        orderedColumns[i][2] = 0;
        orderedColumns[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j + 1];
          if (firstNum === secondNum) {
            moveScore += firstNum;
            orderedColumns[i][j] = firstNum + secondNum;
            orderedColumns[i][j + 1] = 0;
          } else if (firstNum === 0 && secondNum !== 0) {
            orderedColumns[i][j] = secondNum;
            orderedColumns[i][j + 1] = 0;
          }
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
    if (!noMoveControl(mergedSquares, squares)) {
      (squares = mergedSquares),
        (gameScore += moveScore),
        fillRandomSquare(),
        lastMoveControl();
    }
  }
  // Move down
  function moveDown() {
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
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        moveScore += orderedColumns[i][0] + orderedColumns[i][2];
        orderedColumns[i][3] *= 2;
        orderedColumns[i][2] = orderedColumns[i][1] * 2;
        orderedColumns[i][1] = 0;
        orderedColumns[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j - 1];
          if (firstNum === secondNum) {
            moveScore += firstNum;
            orderedColumns[i][j] = firstNum + secondNum;
            orderedColumns[i][j - 1] = 0;
          } else if (firstNum === 0 && secondNum !== 0) {
            orderedColumns[i][j] = secondNum;
            orderedColumns[i][j - 1] = 0;
          }
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
    if (!noMoveControl(mergedSquares, squares)) {
      (squares = mergedSquares),
        (gameScore += moveScore),
        fillRandomSquare(),
        lastMoveControl();
    }
  }
  // Move right
  function moveRight() {
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
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        moveScore += orderedRows[i][0] + orderedRows[i][2];
        orderedRows[i][3] *= 2;
        orderedRows[i][2] = orderedRows[i][1] * 2;
        orderedRows[i][1] = 0;
        orderedRows[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j - 1];
          if (firstNum === secondNum) {
            moveScore += firstNum;
            orderedRows[i][j] = firstNum + secondNum;
            orderedRows[i][j - 1] = 0;
          } else if (firstNum === 0 && secondNum !== 0) {
            orderedRows[i][j] = secondNum;
            orderedRows[i][j - 1] = 0;
          }
        }
      }
      mergedRows = orderedRows;
    }
    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[0][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[1][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[2][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[3][i]);
    }
    if (!noMoveControl(mergedSquares, squares)) {
      (squares = mergedSquares),
        (gameScore += moveScore),
        fillRandomSquare(),
        lastMoveControl();
    }
  }
  // Move left
  function moveLeft() {
    let orderedRows = [];
    for (let i = 0; i < 4; i++) {
      let nums = [];
      let zeros = [];
      for (let j = 0; j < 4; j++) {
        rows[i][j] ? nums.push(rows[i][j]) : zeros.push(rows[i][j]);
      }
      let newRow = nums.concat(zeros);
      orderedRows.push(newRow);
    }
    let mergedRows = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        moveScore += orderedRows[i][0] + orderedRows[i][2];
        orderedRows[i][0] *= 2;
        orderedRows[i][1] = orderedRows[i][2] * 2;
        orderedRows[i][2] = 0;
        orderedRows[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j + 1];
          if (firstNum === secondNum) {
            moveScore += firstNum;
            orderedRows[i][j] = firstNum + secondNum;
            orderedRows[i][j + 1] = 0;
          } else if (firstNum === 0 && secondNum !== 0) {
            orderedRows[i][j] = secondNum;
            orderedRows[i][j + 1] = 0;
          }
        }
      }
      mergedRows = orderedRows;
    }
    let mergedSquares = [];
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[0][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[1][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[2][i]);
    }
    for (let i = 0; i < 4; i++) {
      mergedSquares.push(mergedRows[3][i]);
    }
    if (!noMoveControl(mergedSquares, squares)) {
      (squares = mergedSquares),
        (gameScore += moveScore),
        fillRandomSquare(),
        lastMoveControl();
    }
  }
});
