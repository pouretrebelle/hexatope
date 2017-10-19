import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import styles from './VideoModal.sass';

@observer
class VideoModal extends Component {

  @observable modalIsHidden = false;

  constructor(props) {
    super(props);
  }

  closeModal = () => {
    this.modalIsHidden = true;
  }

  render() {
    const wrapperClasses = classNames({
      [styles.modalWrapper]: true,
      [styles.modalHidden]: this.modalIsHidden,
    });

    return (
      <div className={wrapperClasses}>
        <div className={styles.overlay} onClick={this.closeModal}/>
        <div className={styles.modal}>
          <button onClick={this.closeModal} className={styles.closeButton}>close</button>
          <div className={styles.videoWrapper}>
            <iframe src='https://player.vimeo.com/video/238936012?title=0&byline=0&portrait=0&color=a9ffe2' width={600} height={600} frameBorder='0'/>
          </div>
        </div>
      </div>
    );
  }
}

VideoModal.propTypes = {
  UIStore: PropTypes.object,
};

export default VideoModal;
