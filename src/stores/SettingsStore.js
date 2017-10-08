import { observable, action } from 'mobx';
import { TOOL_MODES, MATERIALS } from 'constants/options';

class SettingsStore {

  @observable depthOverlapScalar = 0.5;
  @observable depthCurvatureScalar = 0.5;
  @observable toolMode = TOOL_MODES.DRAW;
  @observable material = MATERIALS.SILVER;

  @action
  setModeToDraw = () => {
    this.toolMode = TOOL_MODES.DRAW;
  }

  @action
  setModeToEdit = () => {
    this.toolMode = TOOL_MODES.EDIT;
  }

  @action
  setModeToErase = () => {
    this.toolMode = TOOL_MODES.ERASE;
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
