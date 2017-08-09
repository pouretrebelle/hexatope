import Point from 'system/Point';
import settings from 'system/settings';

export const drawFilledHexagon = (c, pixelPos, pixelRatio) => {
  const radius = pixelRatio * (settings.hexRadius - settings.hexMargin / 2);
  drawHexagon(c, pixelPos, pixelRatio, radius);
  c.fill();
};

export const drawOutlinedHexagon = (c, pixelPos, pixelRatio) => {
  const radius = pixelRatio * (settings.hexRadius - settings.hexMargin / 2 - settings.hexFocusOffset - settings.hexFocusLineWeight / 2);
  drawHexagon(c, pixelPos, pixelRatio, radius);
  c.stroke();
};

const drawHexagon = (c, pixelPos, pixelRatio, radius) => {
  // draws hexagon with the center pixelPos
  c.save();
  c.translate(pixelPos.x * pixelRatio, pixelPos.y * pixelRatio);
  c.beginPath();
  for (let i = 0; i < 6; i++) {
    c.lineTo(radius * Math.cos(i * Math.PI / 3), radius * Math.sin(i * Math.PI / 3));
  }
  c.closePath();
  c.restore();
};

export const getEdgePoint = (i, offset) => {
  // return position of this edge of the hexagon
  // if (offset == 1) clockwise from middle edge
  // if (offset == 0) middle of edge
  // if (offset == -1) anti-clockwise from middle edge
  const halfHexHeight = Math.sqrt(3) / 2;
  let point = new Point(offset * settings.hexDoubleLineOffset / 2, -halfHexHeight);
  point.rotate(i * Math.PI / 3);
  point.edge = i;
  return point;
};

// following functions use a cheeky formula for estimating a circle arc with cubic beziers
// magnitude of control point as perpendicular to radius =
// (4 / 3) * Math.tan(Math.PI / 2n)
// where n is the amount of segments of the circle

export const getControlMagnitudeAdjacent = (offset) => (
  // the magnitude of the control point for 1/3rd of a circle, give or take offset
  4 / 9 * Math.sqrt(3) * ((1 - offset * settings.hexDoubleLineOffset) / 2)
);

export const getControlMagnitudeWide = (offset) => (
  // the magnitude of the control point for 1/6th of a circle, give or take offset
  (8 - 4 * Math.sqrt(3)) / 3 * ((3 - offset * settings.hexDoubleLineOffset) / 2)
);
