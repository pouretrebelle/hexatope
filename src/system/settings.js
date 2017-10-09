export default {
  hexRadius: 30,
  hexLineWeight: 2,
  hexDoubleLineOffset: 0.3,
  hexMargin: 4,
  hexFocusOffset: 2,
  hexFocusLineWeight: 4,
  drawHex: true,
  drawGrid: true,
  drawCurves: true,
  gridColor: '#fafafa',
  mouseColor: '#e5e6e8',
  mouseActiveColor: '#e0e1e2',
  mouseEraseColor: '#ffffff',
  mouseEraseActiveColor: 'rgba(249, 250, 251, 0.8)',
  mouseEditColor: 'rgba(255, 255, 255, 0)',
  mouseEditActiveColor: '#e0e1e2',
  inactiveColor: '#ffffff',
  activeColor: '#f6f7f8',
  doubleActiveColor: '#eaebed',
  focusColor: '#f6f7f8',
  lineColor: '#000000',
  lineColorFaded: 'rgba(0, 0, 0, 0.2)',
  tubeThickness: 5,
  cameraRotateSpeed: 5,
  cameraDampingFactor: 0.2,
  cameraMinDistance: 5,
  cameraMaxDistance: 80,
  animationSpeed: 1.5,
  animationStep: 8 * 6,
  animationRangeMax: 20 * 8 * 6,
  showDownloadButtons: false,
  wireLengthPerCm3: 300,
  maxRewardVolumeCm3: 0.7,
};

export const demoModelSettings = {
  tubeSegments: 20,
  tubeRadiusSegments: 8,
  scale: 1,
};

export const exportModelSettings = {
  tubeSegments: 30,
  tubeRadiusSegments: 20,
  scale: 5.88, // map to mm
};
