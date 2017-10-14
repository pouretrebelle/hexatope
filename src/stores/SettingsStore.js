import { observable, action } from 'mobx';
import { TOOL_MODES, GRID_ROTATION, MATERIALS } from 'constants/options';

class SettingsStore {

  @observable depthOverlapScalar = 0.5;
  @observable depthCurvatureScalar = 0.5;
  @observable toolMode = TOOL_MODES.DRAW;
  @observable gridRotation = GRID_ROTATION.VERTICAL;
  @observable material = MATERIALS.SILVER;
  @observable hangingPoint = undefined;

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
  setGridRotation = (rotation) => {
    this.gridRotation = rotation;
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

  @action
  choseHangingPoint = (curve) => {
    this.hangingPoint = curve;
  }

}

export default new SettingsStore();
