//Display / UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 2;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const mineLeftText = document.querySelector("[data-mine-count");
const messageText = document.querySelector(".subtext");

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGame();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMineCounts();
    });
  });
});

boardElement.style.setProperty("--size", BOARD_SIZE);
mineLeftText.textContent = NUMBER_OF_MINES;

function listMineCounts() {
  const markTileCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);
  mineLeftText.textContent = NUMBER_OF_MINES - markTileCount;
}

function checkGame() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You Win";
  }

  if (lose) {
    messageText.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
