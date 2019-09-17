const {
  wrapAround,
  wrapAroundNegative,
  makeGrid,
  findArrowCoordsBasedOnDirection,
  drawTriangle,
  placeRobotImage,
  placeArrowOnGrid
} = require('../main.js');

describe('utils work for', () => {
  test('normal case', () => {
    const expectedResult = 2;
    expect(wrapAround(1, 4)).toEqual(expectedResult);
  });
  test('wrap case', () => {
    const expectedResult = 0;
    expect(wrapAround(4, 4)).toEqual(expectedResult);
  });
  test('string', () => {
    const expectedResult = 2;
    expect(wrapAround('01', 4)).toEqual(expectedResult);
  });
  test('normal case negative', () => {
    const expectedResult = 2;
    expect(wrapAroundNegative(3, 4)).toEqual(expectedResult);
  });
  test('wrap case negative', () => {
    const expectedResult = 4;
    expect(wrapAroundNegative(0, 4)).toEqual(expectedResult);
  });
  test('string negative', () => {
    const expectedResult = 0;
    expect(wrapAroundNegative('01', 4)).toEqual(expectedResult);
  });
});

const mockGrid = [
  [
    [
      10, 10, 16, 16
    ],
    [26, 10, 16, 16]
  ],
  [
    [
      10, 26, 16, 16
    ],
    [26, 26, 16, 16]
  ]
]

describe('grid', () => {
  test('builds', () => {
    const testGrid = makeGrid(100, 100, 2)
    expect(testGrid.length).toEqual(2);
    expect(testGrid).toEqual(expect.arrayContaining(mockGrid));
  });
});

describe('arrow positioning works', () => {
  test('for arrow up', () => {
    const testArrow = findArrowCoordsBasedOnDirection([
      30, 40
    ], 20, 10, 'up');
    const expectedArrowBaseCoords = [
      [
        40, 50
      ],
      [20, 50]
    ];
    expect(testArrow.length).toEqual(2);
    expect(testArrow).toEqual(expect.arrayContaining(expectedArrowBaseCoords));
  });
});

const mockContext = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  fill: jest.fn(),
  clearRect: jest.fn(),
  drawImage: jest.fn(),
  strokeRect: jest.fn()
}

describe('drawTriangle', () => {
  test('draws triangle with appropriate coordinates', () => {
    drawTriangle(mockContext, [
      100, 200
    ], 12, 'up');
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(106, 206);
    expect(mockContext.lineTo).toHaveBeenCalledWith(107.8, 208.4);
    expect(mockContext.lineTo).toHaveBeenCalledWith(107.8, 208.4);
    expect(mockContext.fill).toHaveBeenCalled();
  });
});

describe('placeRobotImage', () => {
  test('puts the robot icon in the correct place', () => {
    const mockImage = 'mock';
    const mockSide = 10;
    const mockCell = [20,40];
    placeRobotImage(mockContext, 400, 600, [20,40], mockSide, mockImage);
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 400, 600);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, ...mockCell, mockSide, mockSide);
  });
});

describe('placeArrowOnGrid', () => {
  test('redraws the grid and draws the arrow', () => {
    const mockSide = 10;
    placeArrowOnGrid(mockContext, 100, 100, mockGrid, 1, 1, 0, mockSide);
    expect(mockContext.strokeRect).toHaveBeenCalledTimes(4);
  });
});
