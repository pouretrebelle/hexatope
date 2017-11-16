import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withCookies, Cookies } from 'react-cookie';
import { reaction } from 'mobx';
import classNames from 'classnames';

import DemoSettings from 'components/DemoSettings';

import styles from './DemoWrapper.sass';

@inject('SettingsStore', 'UIStore') @observer
class Demo extends Component {

  constructor(props) {
    super(props);
    this.demoElement = undefined;
    this.demoWrapperElement = undefined;

    this.state = {
      newsletterEmail: '',
      newsletterPopupClosed: this.props.cookies.get('hexatopeSignedUpToNewsletter'),
    };
  }

  componentDidMount() {
    const { system, UIStore, SettingsStore } = this.props;

    system.demo.setup(this.demoElement, this.demoWrapperElement, UIStore);

    // resize canvas when window size is changed
    this.windowSizeReaction = reaction(
      () => [
        UIStore.windowWidth,
        UIStore.windowHeight,
      ],
      () => this.resizeDemo(),
    );

    // render and animate demo when mobile tabs are changed
    this.mobileTabsReaction = reaction(
      () => [
        UIStore.demoVisibleOnMobile,
      ],
      () => this.renderDemo(true),
    );

    // render demo and update chain position when settings are changed
    this.settingsReaction = reaction(
      () => [
        SettingsStore.depthOverlapScalar,
        SettingsStore.depthCurvatureScalar,
      ],
      () => this.reactToSettingsChange(),
    );

    // render demo and update chain material when settings are changed
    this.materialReaction = reaction(
      () => [
        SettingsStore.material,
      ],
      () => this.reactToMaterialChange(),
    );

    // check mouse position
    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [
        UIStore.mouseY,
        UIStore.mouseX,
      ],
      () => this.checkMousePosition(),
    );
  }

  checkMousePosition = () => {
    const { UIStore, system } = this.props;
    const boundingBox = this.demoWrapperElement.getBoundingClientRect();
    if (boundingBox.left <= UIStore.mouseX &&
        UIStore.mouseX <= boundingBox.right &&
        boundingBox.top <= UIStore.mouseY &&
        UIStore.mouseY <= boundingBox.bottom
    ) {
      if (!UIStore.isMouseOverDemo) UIStore.mouseIsOverDemo();
    } else {
      if (UIStore.isMouseOverDemo) UIStore.mouseNotOverDemo();
    }

    if (UIStore.isChosingHangingPoint) system.demo.updateHangingPointAngle();
  }

  reactToSettingsChange = () => {
    this.props.system.demo.updateChainPosition(0, true);
    this.renderDemo(false);
  }

  reactToMaterialChange = () => {
    this.props.system.demo.updateChainMaterial();
    this.renderDemo(false);
  }

  renderDemo = (animate) => {
    const { system } = this.props;

    if (!system || !system.demo) return;

    if (animate) {
      system.demo.updateAndAnimateCurves();
    }
    else {
      system.demo.updateCurves();
    }
  }

  resizeDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateDimensions(this.demoWrapperElement, this.props.UIStore);
  }

  onNewsletterEmailChanged = (e) => {
    this.setState({
      newsletterEmail: e.target.value,
    });
  }

  closeNewsletterPopup = (e) => {
    e.preventDefault();
    this.setState({
      newsletterPopupClosed: true,
    });
  }

  submitNewsletterForm = () => {
    this.props.cookies.set('hexatopeSignedUpToNewsletter', true);
  }

  render() {
    const { system, UIStore } = this.props;
    const { newsletterEmail, newsletterPopupClosed } = this.state;
    const wrapperClasses = classNames({
      [styles.demoWrapper]: true,
      [styles.demoHiddenOnMobile]: !UIStore.demoVisibleOnMobile,
    });
    const newsletterPopupClasses = classNames({
      [styles.newsletterPopup]: true,
      [styles.newsletterPopupVisible]: !UIStore.demoIsEmpty && !newsletterPopupClosed,
    });

    return (
      <div
        className={wrapperClasses}
        ref={element => this.demoWrapperElement = element}
      >
        <div className={newsletterPopupClasses}>
          <form
            action={'https://hexatope.us17.list-manage.com/subscribe/post?u=4c51e43f1162adc62d41e6ea5&amp;id=7a87ac0c36'}
            method={'post'}
            target={'_blank'}
            className={styles.newsletterPopupForm}
            noValidate
            onSubmit={this.submitNewsletterForm}
          >
            <button
              onClick={this.closeNewsletterPopup}
              className={styles.newsletterPopupCloseButton}
              type={'button'}
            >
              close
            </button>
            <p className={styles.newsletterPopupHint}>
              Sign up to our newsletter to hear when Hexatope products become available for purchase:
            </p>
            <div className={styles.newsletterPopupFields}>
              <label
                htmlFor={'mce-EMAIL'}
                style={{ display: 'none' }}
              >
                Email Address
              </label>
              <input
                type={'email'}
                name={'EMAIL'}
                id={'mce-EMAIL'}
                onChange={this.onNewsletterEmailChanged}
                value={newsletterEmail}
                className={styles.newsletterPopupEmailField}
                placeholder={'Email Address'}
              />
              <div
                style={{ position: 'absolute', left: -5000 }}
                aria-hidden={true}
              >
                <input
                  type={'text'}
                  name={'b_4c51e43f1162adc62d41e6ea5_7a87ac0c36'}
                  tabIndex={-1}
                  value={''}
                />
              </div>
              <div className={styles.newsletterPopupSubmitButtonWrapper}>
                <button
                  type={'submit'}
                  name={'subscribe'}
                  className={styles.newsletterPopupSubmitButton}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>
        </div>
        <DemoSettings system={system} />
        <canvas
          ref={element => this.demoElement = element}
        />
      </div>
    );
  }
}

Demo.propTypes = {
  UIStore: PropTypes.object,
  SettingsStore: PropTypes.object,
  system: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(Demo);
