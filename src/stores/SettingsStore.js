import { observable, action } from 'mobx';

class SettingsStore {

  @observable depthScalar = 0.5;

  @action
  updateDepth = (scalar) => {
    this.depthScalar = scalar;
  }

}

export default new SettingsStore();
