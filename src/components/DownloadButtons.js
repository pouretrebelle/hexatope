import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './DownloadButtons.sass';

class DownloadButtons extends Component {

  constructor(props) {
    super(props);

    this.fileReader = new FileReader();
    this.fileReader.onload = this.importFile;
  }

  componentDidMount() {
    window.addEventListener('paste', this.onPasted);
  }

  componentWillUnmount() {
    window.removeEventListener(this.onPasted);
  }

  onPasted = (e) => {
    const json = JSON.parse(e.clipboardData.getData('Text'));
    if (!json || !json.canvas) return;

    this.props.system.importJSON(json);
  }

  onImportInputChanged = (e) => {
    this.fileReader.readAsText(e.target.files[0]);
  }

  importFile = (e) => {
    const json = JSON.parse(e.target.result);
    if (!json || !json.canvas) return;

    this.props.system.importJSON(json);
  }

  onExportTXTButtonClicked = () => {
    this.props.system.exportTXT();
  }

  onExportJSONButtonClicked = (withSettings) => {
    this.props.system.exportJSON(withSettings);
  }

  onSVGButtonClicked = () => {
    this.props.system.canvas.downloadSVG();
  }

  onPNGButtonClicked = () => {
    this.props.system.demo.downloadPNG();
  }

  onSTLButtonClicked = () => {
    this.props.system.demo.downloadSTL();
  }

  render() {
    return (
      <div className={styles.buttons}>
        <input
          type={'file'}
          accept={'application/json'}
          onChange={this.onImportInputChanged}
          className={styles.button}
        />
        <button className={styles.button} onClick={this.onExportTXTButtonClicked}>
          Export TXT
        </button>
        <button className={styles.button} onClick={() => this.onExportJSONButtonClicked(true)}>
          Export JSON w/settings
        </button>
        <button className={styles.button} onClick={() => this.onExportJSONButtonClicked(false)}>
          Export JSON
        </button>
        <button className={styles.button} onClick={this.onSVGButtonClicked}>
          Download SVG
        </button>
        <button className={styles.button} onClick={this.onPNGButtonClicked}>
          Download PNG
        </button>
        <button className={styles.button} onClick={this.onSTLButtonClicked}>
          Download STL
        </button>
      </div>
    );
  }
}

DownloadButtons.propTypes = {
  system: PropTypes.object.isRequired,
};

export default DownloadButtons;
