import { observable, action } from 'mobx';
import { TOOL_MODES, MATERIALS } from 'constants/options';

class SettingsStore {

  @observable depthOverlapScalar = 0.5;
  @observable depthCurvatureScalar = 0.5;
  @observable toolMode = TOOL_MODES.PENCIL;
  @observable material = MATERIALS.SILVER;

  @action
  setModeToPencil = () => {
    this.toolMode = TOOL_MODES.PENCIL;
  }

  @action
  setModeToEraser = () => {
    this.toolMode = TOOL_MODES.ERASER;
  }

  @action
  setMaterialToGold = () => {
    this.material = MATERIALS.GOLD;
  }

  @action
  setMaterialToSilver = () => {
    this.material = MATERIALS.SILVER;
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
