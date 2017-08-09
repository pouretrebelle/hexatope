import Vector2 from 'utils/Vector2';

class Point extends Vector2 {
  constructor(x, y, z) {
    super();
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
}

export default Point;
