import Vector2 from 'utils/Vector2';
import SettingsStore from 'stores/SettingsStore';
import { observable, action, computed } from 'mobx';

class Point extends Vector2 {
  constructor(x, y) {
    super();
    this.x = x || 0;
    this.y = y || 0;
  }

  @observable depthOverlap = 0;
  @observable depthCurvature = 0;

  @computed get z() {
    return SettingsStore.depthOverlapScalar * this.depthOverlap + SettingsStore.depthCurvatureScalar * this.depthCurvature;
  }

  @action setDepthOverlap = (depth) => {
    this.depthOverlap = depth;
  }

  @action setDepthCurvature = (depth) => {
    this.depthCurvature = depth;
  }
}

export default Point;
