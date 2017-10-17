import SettingsStore from 'stores/SettingsStore';
import { action, reaction } from 'mobx';

class GTMTracking {
  constructor() {
    this.TagManager = undefined;
    this.dataLayer = undefined;
  }

  initialize(TagManager) {
    this.TagManager = TagManager;
    this.dataLayer = window.dataLayer;

    // track initial state and any changes to settings
    // debounced by a second so slider changes aren't over-registered
    this.testReaction = reaction(
      () => SettingsStore.trackableSettings,
      this.addToDataLayer,
      {
        fireImmediately: true,
        delay: 1000,
      }
    );
  }

  @action
  trackEvent = (eventName, additionalProps) => {
    this.addToDataLayer({
      event: eventName,
      ...additionalProps,
    });
  }

  addToDataLayer = (data) => {
    if (this.dataLayer) this.dataLayer.push(data);
  }
}

export default new GTMTracking();
