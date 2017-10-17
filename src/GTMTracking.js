import SettingsStore from 'stores/SettingsStore';
import UIStore from 'stores/UIStore';
import { action, reaction } from 'mobx';
import { TOOL_MODES } from 'constants/options';

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
    this.settingsReaction = reaction(
      () => SettingsStore.trackableSettings,
      (settings) => {
        this.addToDataLayer('settingsChange', settings);
      },
      {
        fireImmediately: true,
        delay: 1000,
      }
    );

    // track drawing time incl length of interaction
    this.canvasMouseReaction = reaction(
      () => UIStore.lastMouseDownTimeTaken,
      (time) => {
        this.trackEvent('mouseDownOverCanvas', {
          timeElapsed: time,
          toolMode: (UIStore.lastMouseButton == 2) ? TOOL_MODES.ERASE : SettingsStore.toolMode, // todo: refactor actual tool mode
        });
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
