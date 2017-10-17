import SettingsStore from 'stores/SettingsStore';
import { reaction } from 'mobx';

class TrackingEvents {
  constructor() {
    this.TagManager = undefined;
    this.dataLayer = undefined;
  }

  initialize(TagManager) {
    this.TagManager = TagManager;
    this.dataLayer = window.dataLayer;

    // track any changes to settings
    // debounced by a second so slider changes aren't over-register
    this.testReaction = reaction(
      () => SettingsStore.trackableSettings,
      this.addToDataLayer,
      {
        fireImmediately: true,
        delay: 1000,
      }
    );
  }

  addToDataLayer = (data) => {
    if (this.dataLayer) this.dataLayer.push(data);
  }
}

export default new TrackingEvents;
