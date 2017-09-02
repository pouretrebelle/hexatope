import { observable, action } from 'mobx';
import * as MODES from 'constants/toolModes';

class SettingsStore {

  @observable depthOverlapScalar = 0.5;
  @observable depthCurvatureScalar = 0.5;
  @observable toolMode = MODES.PENCIL_MODE;

  @action
  setModeToPencil = () => {
    this.toolMode = MODES.PENCIL_MODE;
  }

  @action
  setModeToEraser = () => {
    this.toolMode = MODES.ERASER_MODE;
  }

  @action
  updateDepthOverlap = (scalar) => {
    this.depthOverlapScalar = scalar;
  }

  @action
  updateDepthCurvature = (scalar) => {
    this.depthCurvatureScalar = scalar;
  }

}

export default new SettingsStore();
