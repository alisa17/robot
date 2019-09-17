function calculateGridUnitLengthBasedOnScreen(width, height, gridCellsPerSide) {
  const gridSideToScreenSideRatio = 0.8;
  const shorterSide = Math.min(width, height);
  const gridSideLength = shorterSide * gridSideToScreenSideRatio;
  return gridSideLength / gridCellsPerSide;
}

function makeGrid(availableWidth, availableHeight, gridCellsPerSide) {
  const gridUnitLength = calculateGridUnitLengthBasedOnScreen(availableWidth, availableHeight, 5);
  const p1x = availableWidth * 0.1;
  const p1y = availableHeight * 0.1;
  const dummyRow = [...Array(gridCellsPerSide).keys()];
  const startingPoints = dummyRow.map(rowNumber => dummyRow.map(x => [
    p1x + gridUnitLength * x,
    p1y + gridUnitLength * rowNumber
  ]));
  const allRows = dummyRow.map(rowNumber => dummyRow.map(a => [
    ...startingPoints[rowNumber][a],
    gridUnitLength,
    gridUnitLength
  ]));
  return allRows;
}

const findArrowCoordsBasedOnDirection = (middle, base, height, direction) => coordinateFindingFunctions[direction](middle, base, height);

const coordinateFindingFunctions = {
  up: function(middle, base, height) {
    const p1 = [
      middle[0] + 0.5 * base,
      middle[1] + height
    ];
    const p2 = [
      middle[0] - 0.5 * base,
      middle[1] + height
    ];
    return [p1, p2];
  },
  right: function(middle, base, height) {
    const p1 = [
      middle[0] - height,
      middle[1] - base * 0.5
    ];
    const p2 = [
      middle[0] - height,
      middle[1] + base * 0.5
    ];
    return [p1, p2];
  },
  down: function(middle, base, height) {
    const p1 = [
      middle[0] - base * 0.5,
      middle[1] - height
    ];
    const p2 = [
      middle[0] + base * 0.5,
      middle[1] - height
    ];
    return [p1, p2];
  },
  left: function(middle, base, height) {
    const p1 = [
      middle[0] + height,
      middle[1] - base * 0.5
    ];
    const p2 = [
      middle[0] + height,
      middle[1] + base * 0.5
    ];
    return [p1, p2];
  }
}

const calculateNewPositionBasedOnDirection = (currentRow, currentColumn, direction) => {
  return positionCalculatingFunctions[direction](currentRow, currentColumn);
}

const positionCalculatingFunctions = {
  up: function(row, column) {
    return [
      wrapAroundNegative(row, 4),
      column
    ];
  },
  right: function(row, column) {
    return [
      row,
      wrapAround(column, 4)
    ];
  },
  down: function(row, column) {
    return [
      wrapAround(row, 4),
      column
    ];
  },
  left: function(row, column) {
    return [
      row,
      wrapAroundNegative(column, 4)
    ];
  }
}

const directions = Object.keys(coordinateFindingFunctions);

function drawTriangle(ctx, centre, side, direction) {
  const triangleBaseSide = 0.3 * side;
  const triangleHeight = 0.2 * side;
  const middleOfGrid = centre.map(coord => coord + 0.5 * side);
  const [p1,
    p2] = findArrowCoordsBasedOnDirection(middleOfGrid, triangleBaseSide, triangleHeight, direction);
  ctx.beginPath();
  ctx.moveTo(...middleOfGrid);
  ctx.lineTo(...p1);
  ctx.lineTo(...p2);
  ctx.fillStyle = "red";
  ctx.fill();
}

function placeRobotImage(context, width, height, cell, imageSide, htmlImage) {
  context.clearRect(0, 0, width, height);
  const [topLeftX,
    topLeftY] = cell.slice(0, 2);
  context.drawImage(htmlImage, topLeftX, topLeftY, imageSide, imageSide);
}

function placeArrowOnGrid(context, width, height, rectangleSpecs, i, x, y, side) {
  context.clearRect(0, 0, width, height);
  // draw grid
  rectangleSpecs.forEach(row => {
    row.forEach(gridUnit => {
      context.lineWidth = 5;
      context.strokeRect(...gridUnit);
    })
  })
  // place arrow in the cell
  const cell = rectangleSpecs[x][y];
  const cellCoords = cell.slice(0, 2);

  const arrowDirection = directions[i];
  drawTriangle(context, cellCoords, side, arrowDirection);
}

window.onload = function() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.getElementById('layer2');
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  const rectangleSpecs = makeGrid(width, height, 5)
  const cellSideForScreen = rectangleSpecs[0][0][3];

  const turnMeAroundButton = document.getElementById('repointArrow');
  turnMeAroundButton.onclick = handleTurn;
  function handleTurn() {
    const arrowCurrentDirectionIndex = turnMeAroundButton.value;
    const newArrowValue = wrapAround(arrowCurrentDirectionIndex, 3);
    turnMeAroundButton.value = newArrowValue;
    const row = Number(makeMeStepButton.getAttribute('valuerow'));
    const column = Number(makeMeStepButton.getAttribute('valuecolumn'));
    placeArrowOnGrid(context, width, height, rectangleSpecs, newArrowValue, row, column, cellSideForScreen);
  }

  const makeMeStepButton = document.getElementById('stepOne');
  makeMeStepButton.onclick = handleStep;
  function handleStep() {
    const arrowCurrentDirectionIndex = turnMeAroundButton.value;
    const currentRow = Number(makeMeStepButton.getAttribute('valuerow'));
    const currentColumn = Number(makeMeStepButton.getAttribute('valuecolumn'));
    const [newRow,
      newColumn] = calculateNewPositionBasedOnDirection(currentRow, currentColumn, directions[arrowCurrentDirectionIndex]);
    makeMeStepButton.setAttribute('valuerow', newRow);
    makeMeStepButton.setAttribute('valuecolumn', newColumn);
    const newCellTopLeftCoord = rectangleSpecs[newRow][newColumn];
    placeArrowOnGrid(context, width, height, rectangleSpecs, turnMeAroundButton.value, newRow, newColumn, cellSideForScreen);
    placeRobotImage(contextRobot, width, height, newCellTopLeftCoord, cellSideForScreen, robotPic);
  }

  // set up layer for robot image
  const canvasRobot = document.getElementById('layer1');
  canvasRobot.width = width;
  canvasRobot.height = height;
  const contextRobot = canvasRobot.getContext('2d');
  const robotPic = document.querySelector("img");

  // put the robot and the arrow in the initial spot on the grid
  const firstValueRow = Number(makeMeStepButton.getAttribute('valuerow'));
  const firstValueColumn = Number(makeMeStepButton.getAttribute('valuecolumn'));
  const firstCellPositionTopLeftCoords = rectangleSpecs[firstValueRow][firstValueColumn];
  placeArrowOnGrid(context, width, height, rectangleSpecs, 0, firstValueRow, firstValueColumn, cellSideForScreen);
  placeRobotImage(contextRobot, width, height, firstCellPositionTopLeftCoords, cellSideForScreen, robotPic);
}

// utils
const wrapAround = (myNumber, wrapAroundNumber) => myNumber == wrapAroundNumber
  ? 0
  : Number(myNumber) + 1;

const wrapAroundNegative = (myNumber, wrapAroundNumber) => myNumber == 0
  ? wrapAroundNumber
  : Number(myNumber) - 1;

// for unit testing
if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
  module.exports = {
    wrapAround,
    wrapAroundNegative,
    makeGrid,
    findArrowCoordsBasedOnDirection,
    drawTriangle,
    placeRobotImage,
    placeArrowOnGrid
  }
}
