function calculateGridUnitLengthBasedOnScreen(width, height) {
  const shorterSide = Math.min(width, height);
  const gridSideLength = shorterSide * 0.8;
  return gridSideLength / 5;
}

function makeGrid(availableWidth, availableHeight) {
  const gridUnitLength = calculateGridUnitLengthBasedOnScreen(availableWidth, availableHeight);
  const p1x = availableWidth * 0.1;
  const p1y = availableHeight * 0.1;
  const dummyRow = [...Array(5).keys()];
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

const findArrowCoordsBasedOnDirection = (middle, base, height, direction) => coordinateFindingFunctions[direction](middle, base, height, direction);

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
  ctx.fill();
}

window.onload = function() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  const rectangleSpecs = makeGrid(width, height)

  const turnMeAroundButton = document.getElementById('repointArrow');
  turnMeAroundButton.onclick = handleTurn;
  function handleTurn() {
    const arrowCurrentDirectionIndex = turnMeAroundButton.value;
    turnMeAroundButton.value = wrapAround(arrowCurrentDirectionIndex, 3)
    placeArrowOnGrid(turnMeAroundButton.value, Number(makeMeStepButton.getAttribute('valuerow')), Number(makeMeStepButton.getAttribute('valuecolumn')));
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
    placeArrowOnGrid(turnMeAroundButton.value, Number(makeMeStepButton.getAttribute('valuerow')), Number(makeMeStepButton.getAttribute('valuecolumn')));
  }

  function placeArrowOnGrid(i, x, y) {
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
    const gridSide = cell[3];

    arrowDirection = directions[i];
    drawTriangle(context, cellCoords, gridSide, arrowDirection);
  }

  placeArrowOnGrid(0, Number(makeMeStepButton.getAttribute('valuerow')), Number(makeMeStepButton.getAttribute('valuecolumn')));

}

// utils
const wrapAround = (myNumber, wrapAroundNumber) => myNumber == wrapAroundNumber
  ? 0
  : Number(myNumber) + 1;

const wrapAroundNegative = (myNumber, wrapAroundNumber) => myNumber == 0
  ? wrapAroundNumber
  : Number(myNumber) - 1;
