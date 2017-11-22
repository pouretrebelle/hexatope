import { observable, computed, action } from 'mobx';
import { TOOL_MODES, GRID_ROTATION, MATERIALS } from 'constants/options';
import { roundToDecimalPlace } from 'utils/numberUtils';

class SettingsStore {

  @observable depthOverlapScalar = 0.5;
  @observable depthCurvatureScalar = 0.5;
  @observable toolMode = TOOL_MODES.DRAW;
  @observable gridRotation = GRID_ROTATION.VERTICAL;
  @observable material = MATERIALS.SILVER;
  @observable hangingPointAngle = undefined;

  @computed get trackableSettings() {
    return {
      'depthOverlapScalar': this.depthOverlapScalar,
      'depthCurvatureScalar': this.depthCurvatureScalar,
      'toolMode': this.toolMode,
      'gridRotation': this.gridRotation,
      'material': this.material,
    };
  }

  @computed get exportSettings() {
    // if being rendered as a vertical we have to remove a turn because it's imported as horizontal
    const rotatedAngle = (this.gridRotation === GRID_ROTATION.VERTICAL) ? this.hangingPointAngle : (Math.PI * 1.5 + this.hangingPointAngle) % (Math.PI * 2);
    return {
      'depthOverlapScalar': roundToDecimalPlace(this.depthOverlapScalar, 3),
      'depthCurvatureScalar': roundToDecimalPlace(this.depthCurvatureScalar, 3),
      'material': this.material,
      'hangingPointAngle': roundToDecimalPlace(rotatedAngle, 3),
    };
  }

  @action
  importSettings = (settings) => {
    this.depthOverlapScalar = settings.depthOverlapScalar;
    this.depthCurvatureScalar = settings.depthCurvatureScalar;
    this.material = settings.material;
    this.hangingPointAngle = settings.hangingPointAngle;
  }

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
  resetGridRotation = () => {
    this.gridRotation = GRID_ROTATION.VERTICAL;
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
  updateHangingPointAngle = (angle) => {
    this.hangingPointAngle = angle;
  }

}

export default new SettingsStore();
