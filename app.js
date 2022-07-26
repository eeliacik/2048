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
  let animationData = {
    moves: [],
    popUps: [],
  };
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
      square.classList.add(`color-${num}`);
    }
  }
  function columnsMoveCheck(direction) {
    console.log('columns: ', columns);

    animationData.moves = [];
    animationColumns = [[0], [0], [0], [0]];
    for (let i = 0; i < 4; i++) {
      const checkColumn =
        direction === 'up' ? columns[i] : columns[i].reverse();
      checkColumn.reduce((_, current, index) => {
        if (current === 0) {
          animationColumns[i].push(0);
        } else {
          let moveCount = index;
          let equalCount = 0;
          let blocker = false;
          for (let j = index - 1; j > -1; j--) {
            if (checkColumn[j] !== current && checkColumn[j] !== 0) {
              blocker = true;
              moveCount--;
            } else if (checkColumn[j] === current) {
              equalCount++;
              if (blocker) {
                moveCount--;
              }
            }
          }
          if (equalCount > 1) {
            moveCount--;
          }
          animationColumns[i].push(moveCount);
        }
      });
    }
    if (direction !== 'up') {
      animationColumns.forEach((column) => {
        column.reverse();
      });
    }
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.moves.push(column[i]);
      });
    }
  }
  function rowsMoveCheck(direction) {
    console.log('rows: ', rows);

    animationData.moves = [];
    animationRows = [[0], [0], [0], [0]];

    for (let i = 0; i < 4; i++) {
      const checkRow = direction === 'left' ? rows[i] : rows[i].reverse();

      checkRow.reduce((_, current, index) => {
        if (current === 0) {
          animationRows[i].push(0);
        } else {
          let moveCount = index;
          let equalCount = 0;
          let blocker = false;

          for (let j = index - 1; j > -1; j--) {
            if (checkRow[j] !== current && checkRow[j] !== 0) {
              blocker = true;
              moveCount--;
            } else if (checkRow[j] === current) {
              equalCount++;
              if (blocker) {
                moveCount--;
              }
            }
          }
          if (equalCount > 1) {
            moveCount--;
          }
          animationRows[i].push(moveCount);
        }
      });
    }
    if (direction !== 'left') {
      animationRows.forEach((row) => {
        row.reverse();
      });
    }
    animationRows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        animationData.moves.push(row[i]);
      }
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
    fillGameScore();
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

    animationData.popUps = [];
    let animationColumns = [[], [], [], []];

    let mergedColumns = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i].every((num) => num !== 0) &&
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        animationColumns[i] = [1, 1, 0, 0];
        moveScore += orderedColumns[i][0] + orderedColumns[i][2];
        orderedColumns[i][0] *= 2;
        orderedColumns[i][1] = orderedColumns[i][2] * 2;
        orderedColumns[i][2] = 0;
        orderedColumns[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j + 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum;
              orderedColumns[i][j] = firstNum + secondNum;
              orderedColumns[i][j + 1] = 0;
              animationColumns[i].push(1);
            } else if (secondNum === 0) {
              animationColumns[i].push(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationColumns[i].push(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedColumns[i][j] = secondNum;
              orderedColumns[i][j + 1] = 0;
              animationColumns[i].push(0);
            } else {
              animationColumns[i].push(0);
            }
          }
        }
      }
      if (animationColumns[i].length < 4) {
        animationColumns[i].push(0);
      }
      mergedColumns = orderedColumns;
    }

    console.log('merge pop-up animation columns', animationColumns);
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.popUps.push(column[i]);
      });
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
      animateNumberMove('up');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
      }, 80);
    }
  }
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

    animationData.popUps = [];
    let animationColumns = [[], [], [], []];

    let mergedColumns = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedColumns[i].every((num) => num !== 0) &&
        orderedColumns[i][0] === orderedColumns[i][1] &&
        orderedColumns[i][2] === orderedColumns[i][3]
      ) {
        animationColumns[i] = [0, 0, 1, 1];
        moveScore += orderedColumns[i][0] + orderedColumns[i][2];
        orderedColumns[i][3] *= 2;
        orderedColumns[i][2] = orderedColumns[i][1] * 2;
        orderedColumns[i][1] = 0;
        orderedColumns[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedColumns[i][j];
          let secondNum = orderedColumns[i][j - 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum;
              orderedColumns[i][j] = firstNum + secondNum;
              orderedColumns[i][j - 1] = 0;
              animationColumns[i].unshift(1);
            } else if (secondNum === 0) {
              animationColumns[i].unshift(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationColumns[i].unshift(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedColumns[i][j] = secondNum;
              orderedColumns[i][j - 1] = 0;
              animationColumns[i].unshift(0);
            } else {
              animationColumns[i].unshift(0);
            }
          }
        }
      }
      if (animationColumns[i].length < 4) {
        animationColumns[i].unshift(0);
      }
      mergedColumns = orderedColumns;
    }

    console.log('merge pop-up animation columns', animationColumns);
    for (let i = 0; i < 4; i++) {
      animationColumns.forEach((column) => {
        animationData.popUps.push(column[i]);
      });
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
      animateNumberMove('down');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
      }, 80);
    }
  }
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

    animationData.popUps = [];
    let animationRows = [[], [], [], []];

    let mergedRows = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i].every((num) => num !== 0) &&
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        animationRows[i] = [0, 0, 1, 1];
        moveScore += orderedRows[i][0] + orderedRows[i][2];
        orderedRows[i][3] *= 2;
        orderedRows[i][2] = orderedRows[i][1] * 2;
        orderedRows[i][1] = 0;
        orderedRows[i][0] = 0;
      } else {
        for (let j = 3; j > 0; j--) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j - 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum;
              orderedRows[i][j] = firstNum + secondNum;
              orderedRows[i][j - 1] = 0;
              animationRows[i].unshift(1);
            } else if (secondNum === 0) {
              animationRows[i].unshift(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationRows[i].unshift(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedRows[i][j] = secondNum;
              orderedRows[i][j - 1] = 0;
              animationRows[i].unshift(0);
            } else {
              animationRows[i].unshift(0);
            }
          }
        }
      }
      if (animationRows[i].length < 4) {
        animationRows[i].unshift(0);
      }
      mergedRows = orderedRows;
    }

    console.log('merge pop-up animation rows', animationRows);
    animationRows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        animationData.popUps.push(row[i]);
      }
    });

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

      rowsMoveCheck('right');
      animateNumberMove('right');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
      }, 80);
    }
  }
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


    animationData.popUps = [];
    let animationRows = [[], [], [], []];

    let mergedRows = [];
    let moveScore = 0;
    for (let i = 0; i < 4; i++) {
      if (
        orderedRows[i].every((num) => num !== 0) &&
        orderedRows[i][0] === orderedRows[i][1] &&
        orderedRows[i][2] === orderedRows[i][3]
      ) {
        animationRows[i] = [1, 1, 0, 0];
        moveScore += orderedRows[i][0] + orderedRows[i][2];
        orderedRows[i][0] *= 2;
        orderedRows[i][1] = orderedRows[i][2] * 2;
        orderedRows[i][2] = 0;
        orderedRows[i][3] = 0;
      } else {
        for (let j = 0; j < 3; j++) {
          let firstNum = orderedRows[i][j];
          let secondNum = orderedRows[i][j + 1];
          if (firstNum !== 0) {
            if (secondNum === firstNum) {
              moveScore += firstNum;
              orderedRows[i][j] = firstNum + secondNum;
              orderedRows[i][j + 1] = 0;
              animationRows[i].push(1);
            } else if (secondNum === 0) {
              animationRows[i].push(0);
            } else if (secondNum !== 0 && secondNum !== firstNum) {
              animationRows[i].push(0);
            }
          } else {
            if (secondNum !== 0) {
              orderedRows[i][j] = secondNum;
              orderedRows[i][j + 1] = 0;
              animationRows[i].push(0);
            } else {
              animationRows[i].push(0);
            }
          }
        }
      }
      if (animationRows[i].length < 4) {
        animationRows[i].push(0);
      }
      mergedRows = orderedRows;
    }

    console.log('merge pop-up animation rows', animationRows);
    animationRows.forEach((row) => {
        for (let i = 0; i < 4; i++) {
        animationData.popUps.push(row[i]);
      }
    });

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

      rowsMoveCheck('left');
      animateNumberMove('left');

      setTimeout(() => {
        fillRandomSquare();
        createOperationArrays();
        lastMoveCheck();
        fillGameScore();
        fillBoard();
        animatePopUp();
      }, 80);
    }
  }
  function animateNumberMove(direction) {
    console.log('animation data: ', animationData.moves);
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      if (animationData.moves[i] !== 0 && direction === 'up') {
        square.classList.add('move-index');
        square.classList.add(`move-up-${animationData.moves[i]}`);
      } else if (animationData.moves[i] !== 0 && direction === 'down') {
        square.classList.add('move-index');
        square.classList.add(`move-down-${animationData.moves[i]}`);
      } else if (animationData.moves[i] !== 0 && direction === 'right') {
        square.classList.add('move-index');
        square.classList.add(`move-right-${animationData.moves[i]}`);
      } else if (animationData[i] !== 0 && direction === 'left') {
        square.classList.add('move-index');
        square.classList.add(`move-left-${animationData.moves[i]}`);
      }
    }
  }
  function animatePopUp() {
    for (let i = 0; i < 16; i++) {
      let square = document.getElementById('sq-' + i);
      if (animationData.popUps[i]) {
        square.classList.add('pop-up');
      }
    }
  }
});

// function animateNumberMoveber(element, count, axis) {
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
