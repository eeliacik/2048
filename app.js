document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  const gameBoardBase = document.querySelector('.game-board-base');
  const gameScoreEl = document.getElementById('game-score');
  const highScoreEl = document.getElementById('high-score');
  document
    .querySelector('.new-game-button')
    .addEventListener('click', resetGame);
  document
    .getElementById('game-over-button')
    .addEventListener('click', closeGameOverDialog);
  document
    .getElementById('game-win-button')
    .addEventListener('click', closeGameWinDialog);

  let squares = [];
  let rows = [];
  let columns = [];
  let animationData = [];
  let gameScore = 0;
  let highScore = 0;
  let gameWon = false;
  let dialogOpen = false;

  fillSquares();
  createBoard();
  createOperationArrays();

  function fillSquares() {
    let zeroSquares = Array(16).fill(0);
    squares = zeroSquares;
  }
  function fillRandomSquare() {
    if (squares.includes(0)) {
      let num = Math.floor(Math.random() * squares.length);
      let twoOrFour = Math.random() > 0.1 ? 2 : 4;
      squares[num] === 0 ? (squares[num] = twoOrFour) : fillRandomSquare();
    }
  }
  function createBoard() {
    // squares = [0, 0, 2, 4, 8, 16, 32, 0, 64, 128, 256, 512, 1024, 2048, 0, 4096,];
    // squares = [0, 0, 0, 2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2];
    fillRandomSquare();
    fillRandomSquare();
    for (let i = 0; i < 16; i++) {
      let squareBase = document.createElement('div');
      squareBase.className = 'game-square-base';
      gameBoardBase.appendChild(squareBase);
      let square = document.createElement('div');
      square.className = 'game-square';
      square.id = 'sq-' + i;
      squares[i] === 0
        ? (square.innerHTML = '')
        : (square.innerHTML = squares[i]);
      gameBoard.appendChild(square);
      numberCheck(i, squares[i]);
    }
  }
  function fillGameScore() {
    gameScoreEl.innerHTML = gameScore;
  }
  function digitCheck(index, num) {
    let square = document.getElementById('sq-' + index);
    square.classList.remove('three-digits', 'four-digits');
    if (num > 99 && num < 1000) {
      square.classList.add('three-digits');
    } else if (num > 999) {
      square.classList.add('four-digits');
    }
  }
  function numberCheck(index, num) {
    let square = document.getElementById('sq-' + index);

    square.classList.remove(
      ...Array.from(square.classList).filter(
        (className) => className !== 'game-square'
      )
    );
    if (num !== 0) {
      square.classList.add('colored-square', `color-${num}`);
    }
  }

  function columnsMoveCheck(direction) {
    console.log(columns);

    animationData = [];
    animationColumns = [[0], [0], [0], [0]];

    for (let i = 0; i < 4; i++) {
      if (direction === 'up') {
        
        let extraMove = 0;
        columns[i].reduce((previous, current) => { previous === 0 || previous === current
          ? [extraMove++, animationColumns[i].push(extraMove)]
          : animationColumns[i].push(extraMove);}, extraMove)

        // if (
        //   columns[i][0] === columns[i][1] &&
        //   columns[i][2] === columns[i][3]
        // ) {
        //   animationColumns[i].push(1, 1, 2);
        // } else {
        //   for (let j = 1; j < 4; j++) {
        //     let num = columns[i][j];
        //     let beforeNum = columns[i][j - 1];
        //     let moveCount = 0;
        //     if (num === 0) {
        //       animationColumns[i].push(0);
        //       moveCount++;
        //     } else if (num !== 0 && beforeNum === num) {
        //       moveCount++;
        //       animationColumns[i].push(moveCount);
        //     } else if (num !== 0 && beforeNum !== num) {
        //       animationColumns[i].push(moveCount);
        //     }
        //   }
        // }

      } else {
        for (let j = 2; j > -1; j--) {
          let num = columns[i][j];
          if (num === 0) {
            animationColumns[i].unshift(0);
          } else if (num !== 0) {
            let moveCount = 0;
            for (let k = 1; k < 4; k++) {
              if (columns[i][j + k] === 0 || columns[i][j + k] === num) {
                moveCount++;
              }
            }
            animationColumns[i].unshift(moveCount);
          }
        }
      }
    }

    animationColumns.forEach((column) => {
      animationData.push(column[0]);
    });
    animationColumns.forEach((column) => {
      animationData.push(column[1]);
    });
    animationColumns.forEach((column) => {
      animationData.push(column[2]);
    });
    animationColumns.forEach((column) => {
      animationData.push(column[3]);
    });
  }

  function rowsMoveCheck() {
    animationData = [];
    animationRows = [[], [], [], []];
    // separate loops for each direction
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (rows[i][j] === 0) {
          animationRows[i].push(0);
        } else if (rows[i][j] !== 0 && rows[i][j] === rows[i][j + 1]) {
          animationRows[i].push(j + 1);
        } else {
          animationRows[i].push(j);
        }
      }
    }
    animationRows.forEach((row) => {
      animationData.push(row[i]);
    });
  }

  function fillBoard() {
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      numberCheck(i, squares[i]);
      digitCheck(i, squares[i]);
      squares[i] === 0
        ? (square.innerHTML = '')
        : (square.innerHTML = squares[i]);
    }
  }
  // Creating operation arrays on horizontal and vertical moves
  function createOperationArrays() {
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
  function noMoveCheck(current, previous) {
    return current.every((num, index) => num === previous[index]);
  }
  function lastMoveCheck() {
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
    } else if (!gameWon && squares.includes(2048)) {
      gameWin();
    }
  }
  function highScoreCheck() {
    if (gameScore > highScore) {
      highScore = gameScore;
      highScoreEl.innerHTML = highScore;
      document.getElementById('game-over-score-title').style.display = 'none';
      document.getElementById('new-high-score-title').style.display = 'block';
    } else {
      document.getElementById('game-over-score-title').style.display = 'block';
      document.getElementById('new-high-score-title').style.display = 'none';
    }
  }
  // Win game
  function gameWin() {
    console.log('YOU WIN!');
    gameWon = true;
    document.getElementById('game-win-score').innerHTML = gameScore;
    document.getElementById('game-win-dialog').classList.add('dialog-fade-in');
    dialogOpen = true;
  }
  // Game over
  function gameOver() {
    console.log('GAME OVER');
    highScoreCheck();
    document.getElementById('game-over-score').innerHTML = gameScore;
    document.getElementById('game-over-dialog').classList.add('dialog-fade-in');
    dialogOpen = true;
  }
  // Close dialogs
  function closeGameWinDialog() {
    document
      .getElementById('game-win-dialog')
      .classList.remove('dialog-fade-in');
    document.getElementById('game-win-dialog').classList.add('dialog-fade-out');
    setTimeout(() => {
      document
        .getElementById('game-win-dialog')
        .classList.remove('dialog-fade-out');
    }, 500);
    dialogOpen = false;
  }
  function closeGameOverDialog() {
    document
      .getElementById('game-over-dialog')
      .classList.remove('dialog-fade-in');
    document
      .getElementById('game-over-dialog')
      .classList.add('dialog-fade-out');
    setTimeout(() => {
      document
        .getElementById('game-over-dialog')
        .classList.remove('dialog-fade-out');
    }, 500);
    dialogOpen = false;
  }
  // Reset game
  function resetGame() {
    gameScore = 0;
    fillSquares();
    fillRandomSquare();
    fillRandomSquare();
    createOperationArrays();
    fillBoard();
  }
  // Move direction controller
  document.addEventListener('keyup', controlArrows);
  function controlArrows(x) {
    if (!dialogOpen && x.keyCode === 38) {
      moveUp();
    } else if (!dialogOpen && x.keyCode === 40) {
      moveDown();
    } else if (!dialogOpen && x.keyCode === 37) {
      moveLeft();
    } else if (!dialogOpen && x.keyCode === 39) {
      moveRight();
    }
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
          if ((firstNum !== 0) & (firstNum === secondNum)) {
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
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      columnsMoveCheck('up');
      animateNum('up');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
      }, 200);
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
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;

      columnsMoveCheck('down');
      animateNum('down');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
      }, 200);
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
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;
      fillRandomSquare();
      createOperationArrays();
      lastMoveCheck();
      fillGameScore();
      fillBoard();
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
    if (!noMoveCheck(mergedSquares, squares)) {
      squares = mergedSquares;
      gameScore += moveScore;
      fillRandomSquare();
      createOperationArrays();
      lastMoveCheck();
      fillGameScore();
      fillBoard();
    }
  }

  function animateNum(direction) {
    console.log(animationData);
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      if (animationData[i] !== 0 && direction === 'up') {
        square.classList.add(`move-up-${animationData[i]}`);
      } else if (animationData[i] !== 0 && direction === 'down') {
        square.classList.add(`move-down-${animationData[i]}`);
      }
    }
  }
});

// function animateNumber(element, count, axis) {
//   const value = `calc(${count * 100}% ${count > 0 ? '+' : '-'} ${
//     count * 0.6
//   }rem)`;
//   element.style.transform = `translate(${axis === 'x' ? value : 0}, ${
//     axis === 'y' ? value : 0
//   })`;
// }

// function cloneEl(element) {
//   element.cloneNode();
//   const clone = element.cloneNode(true);
//   const newEl = document.createElement('div');
//   document.body.appendChild(newEl);
//   document.body.appendChild(clone);
// }
