import Vector2 from 'utils/Vector2';
import SettingsStore from 'stores/SettingsStore';
import { observable, action, computed } from 'mobx';

class Point extends Vector2 {
  constructor(x, y) {
    super();
    this.x = x || 0;
    this.y = y || 0;

    this.controlDirection = undefined;
    this.controlMagnitude = undefined;
  }

  @observable depthOverlap = 0;
  @observable depthCurvature = 0;
  @observable angleOverlap = 0;
  @observable angleCurvature = 0;

  @computed get z() {
    return SettingsStore.depthOverlapScalar * this.depthOverlap + SettingsStore.depthCurvatureScalar * this.depthCurvature;
  }

  @computed get controlPos() {
    if (this.angleOverlap === undefined && this.angleCurvature === undefined) return this.x;

    const averageAngle = SettingsStore.depthOverlapScalar * this.angleOverlap + SettingsStore.depthCurvatureScalar * this.angleCurvature;
    const depth = Math.sin(averageAngle) * this.controlMagnitude;
    const length = Math.cos(averageAngle) * this.controlMagnitude;

    let controlPos = new Vector2(this.x, this.y);
    controlPos.minusEq(this.controlDirection.multiplyNew(length));
    controlPos.z = this.z + depth;

    return controlPos;
  }

  @action setDepthOverlap = (depth) => {
    this.depthOverlap = depth;
  }

  @action setDepthCurvature = (depth) => {
    this.depthCurvature = depth;
  }
}

export default Point;
