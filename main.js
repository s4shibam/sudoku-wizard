// Import CSS File
import './style.css';

// Import JS Files
import { solveSudoku } from './solve-sudoku.js';
import { getPreset } from './sudoku-presets.js';
import { isValidSudoku } from './valid-sudoku.js';

// Declare variables
let numberSelected = null,
  body = null,
  modalBG = null,
  openModal = null,
  isRunning = false,
  logoButton = null,
  modalVideo = null,
  startButton = null,
  resetButton = null,
  numberPlate = null,
  sudokuBoard = null,
  sudokuStatus = null,
  randomButton = null,
  slowVisualization = null,
  isSlowVisualizationEnabled = true;

// Sudoku grid to perform internal operations or apply backtracking algorithm
let sudokuGrid = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.']
];

// Select number to fill the Sudoku board
function numberButtonSelected() {
  // Previously selected number will be unselected
  if (numberSelected) numberSelected.classList.remove('number-button-selected');

  // Currently selected number button will be will be marked as selected
  numberSelected = this;
  numberSelected.classList.add('number-button-selected');
}

// Fill the Sudoku board cells with selected numbers
function cellSelected(cell, row, col) {
  // If Sudoku board is under solving, it would not accept any new input
  if (isRunning) return;

  // Sudoku status is reset for any new input
  sudokuStatus.classList.add('hidden');

  // If any number is selected take action accordingly
  if (numberSelected) {
    // If clear button is selected clear the cell
    if (numberSelected.innerText === 'C') {
      if (cell.innerText !== '') {
        cell.innerText = '';
        cell.classList.remove('input-cell');
        sudokuGrid[row][col] = '.';
      }
    }
    // If any number button is selected put the number in the cell
    else {
      cell.innerText = numberSelected.id;
      cell.classList.add('input-cell');
      sudokuGrid[row][col] = numberSelected.id;
    }
  }
}

// Build number plate for inputs
function buildNumberPlate() {
  for (let num = 0; num < 10; num++) {
    // Create div for each number button
    const numberButton = document.createElement('button');

    // Add css class name "number-button" to each div element
    numberButton.classList.add('number-button');

    // On click select current number button
    numberButton.addEventListener('click', numberButtonSelected);

    // First number button is the clear button
    if (num == 0) {
      // Add id to each div element
      numberButton.id = 'C';
      // Change HTML Content inside "div"
      numberButton.innerHTML = 'C';
    } else {
      // Add id to each div element
      numberButton.id = num;
      // Change HTML Content inside "div"
      numberButton.innerHTML = num;
    }

    // Append each div element in the ".number-plate" div element
    numberPlate.append(numberButton);
  }
}

// Build 9x9 Sudoku board
function buildSudokuBoard() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Create div for each sudoku cell
      const cell = document.createElement('div');

      // Add css class name "cell" to each div element
      cell.classList.add('cell');

      // Add id to each div element
      cell.id = `${row}/${col}`;

      // Sudoku Board outer border decoration
      if (row == 0) cell.classList.add('border-t-black', 'border-t-2');
      if (row == 8) cell.classList.add('border-b-black', 'border-b-2');
      if (col == 0) cell.classList.add('border-l-black', 'border-l-2');
      if (col == 8) cell.classList.add('border-r-black', 'border-r-2');

      // Sudoku Board row-wise inner border decoration
      if (row == 2 || row == 5)
        cell.classList.add('border-b-black', 'border-b-2');

      // Sudoku Board column-wise inner border decoration
      if (col == 3 || col == 6)
        cell.classList.add('border-l-black', 'border-l-2');

      // On click select current cell, mark as input cell
      // and update sudokuGrid Array Object
      cell.addEventListener('click', () => {
        cellSelected(cell, row, col);
      });

      // Append each div element in the ".sudoku-board" div element
      sudokuBoard.append(cell);
    }
  }
}

// Mark Sudoku board validity
function markBoardValidity(isValid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (row == 0 || row == 8 || col == 0 || col == 8) {
        const cellId = row + '/' + col;
        const cell = document.getElementById(cellId);

        // Mark valid
        if (isValid) {
          if (row == 0) {
            cell.classList.remove('border-t-red-500', 'border-t-8');
            cell.classList.add('border-t-green-500', 'border-t-8');
          }
          if (row == 8) {
            cell.classList.remove('border-b-red-500', 'border-b-8');
            cell.classList.add('border-b-green-500', 'border-b-8');
          }
          if (col == 0) {
            cell.classList.remove('border-l-red-500', 'border-l-8');
            cell.classList.add('border-l-green-500', 'border-l-8');
          }
          if (col == 8) {
            cell.classList.remove('border-r-red-500', 'border-r-8');
            cell.classList.add('border-r-green-500', 'border-r-8');
          }
        }
        // Mark invalid
        else {
          if (row == 0) {
            cell.classList.remove('border-t-green-500', 'border-t-8');
            cell.classList.add('border-t-red-500', 'border-t-8');
          }
          if (row == 8) {
            cell.classList.remove('border-b-green-500', 'border-b-8');
            cell.classList.add('border-b-red-500', 'border-b-8');
          }
          if (col == 0) {
            cell.classList.remove('border-l-green-500', 'border-l-8');
            cell.classList.add('border-l-red-500', 'border-l-8');
          }
          if (col == 8) {
            cell.classList.remove('border-r-green-500', 'border-r-8');
            cell.classList.add('border-r-red-500', 'border-r-8');
          }
        }
      }
    }
  }
}

// Update control panel status
function controlPanelStatus(isStart) {
  // Disable non-required buttons while board is under solving
  if (isStart) {
    randomButton.disabled = true;
    startButton.disabled = true;

    // Disable number buttons
    const numberButton = document.querySelectorAll('.number-button');
    numberButton.forEach((eachButton) => {
      eachButton.disabled = true;
    });
  }
  // Enable control panel buttons
  else {
    randomButton.disabled = false;
    startButton.disabled = false;

    // Enable number buttons
    const numberButton = document.querySelectorAll('.number-button');
    numberButton.forEach((eachButton) => {
      eachButton.disabled = false;
    });
  }
}

// Start solving the Sudoku board
async function start() {
  // Sudoku status is reset for every solving attempt
  sudokuStatus.classList.add('hidden');

  // If Sudoku board is invalid then show status as "UNSOLVABLE"
  if (!isValidSudoku(sudokuGrid)) {
    markBoardValidity(false);
    sudokuStatus.innerText = 'UNSOLVABLE!';
    sudokuStatus.classList.remove('text-green-600', 'hidden');
    sudokuStatus.classList.add('text-red-600');
    return;
  } else {
    markBoardValidity(true);
  }

  // If Sudoku board is under solving update running status
  isRunning = true;

  // If Sudoku board is under solving disable visualization checkbox
  slowVisualization.disabled = true;

  // Disable number buttons, start and random button
  controlPanelStatus(true);

  // Start solving Sudoku
  const delay = isSlowVisualizationEnabled ? 50 : 0;
  await solveSudoku(sudokuGrid, delay);

  // If Sudoku board is solved update running status
  isRunning = false;

  // If Sudoku board is solved enable visualization checkbox
  slowVisualization.disabled = false;

  // Enable number buttons, start and random button
  controlPanelStatus(false);

  // Show status as "SOLVED"
  sudokuStatus.innerText = 'SOLVED!';
  sudokuStatus.classList.remove('text-red-600', 'hidden');
  sudokuStatus.classList.add('text-green-600');
}

// Reset Sudoku board and Array
function cleanBoard() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellId = row + '/' + col;
      const cell = document.getElementById(cellId);

      cell.innerText = '';
      sudokuGrid[row][col] = '.';
      cell.classList.remove('input-cell', 'bg-orange-300');
    }
  }
}

// Set pre-defined sudoku grid as input
function setPresetExample() {
  // Reset Sudoku board
  cleanBoard();

  // Get preset example
  let preset = getPreset();

  // Set preset example on the Sudoku board
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellId = row + '/' + col;
      const cell = document.getElementById(cellId);

      if (preset[row][col] != '.') {
        cell.innerText = preset[row][col];
        sudokuGrid[row][col] = preset[row][col];
        cell.classList.add('input-cell', 'bg-orange-300');
      }
    }
  }
}

// Home button
function reloadSite() {
  window.location.reload();
}

// Build the Sudoku Game
function buildSudokuGame() {
  sudokuBoard = document.querySelector('.sudoku-board');
  numberPlate = document.querySelector('.number-plate');
  buildSudokuBoard();
  buildNumberPlate();
}

buildSudokuGame();

// Program starts here - After page is fully loaded
window.addEventListener('load', () => {
  body = document.querySelector('#body');
  logoButton = document.querySelector('#logo');
  startButton = document.querySelector('#start');
  resetButton = document.querySelector('#reset');
  randomButton = document.querySelector('#random');
  modalBG = document.querySelector('#modal-bg');
  openModal = document.querySelector('#open-modal');
  sudokuStatus = document.querySelector('#sudoku-status');
  slowVisualization = document.querySelector('#slow-visualization');
  const modalVideo = document.querySelector('#modal-video');

  if (logoButton) {
    logoButton.addEventListener('click', reloadSite);
  }

  if (startButton) {
    startButton.addEventListener('click', start);
  }

  if (resetButton) {
    resetButton.addEventListener('click', reloadSite);
  }

  if (randomButton) {
    randomButton.addEventListener('click', setPresetExample);
  }

  if (slowVisualization) {
    slowVisualization.addEventListener('change', function () {
      isSlowVisualizationEnabled = this.checked;
    });
  }

  if (openModal) {
    openModal.addEventListener('click', function () {
      modalBG.classList.remove('hidden');
    });
  }

  if (modalBG) {
    modalBG.addEventListener('click', function () {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalBG.classList.add('hidden');
    });
  }

  if (body) {
    body.classList.remove('hidden');
    body.classList.add('grid');
  }

  if (modalVideo) {
    modalVideo.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
});

// Developed with love by Shibam Saha
