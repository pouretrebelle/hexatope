import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withCookies, Cookies } from 'react-cookie';
import classNames from 'classnames';

import styles from './NewsletterPopup.sass';

@inject('UIStore') @observer
class NewsletterPopup extends Component {

  @observable email = '';
  @observable popupClosed = this.props.cookies.get('hexatopeSignedUpToNewsletter');

  constructor(props) {
    super(props);
  }

  onEmailChanged = (e) => {
    this.email = e.target.value;
  }

  closePopup = () => {
    this.popupClosed = true;
  }

  submitForm = () => {
    this.props.cookies.set('hexatopeSignedUpToNewsletter', true);
    this.closePopup();
  }

  render() {
    const { UIStore } = this.props;
    const wrapperClasses = classNames({
      [styles.popup]: true,
      [styles.popupVisible]: !UIStore.demoIsEmpty && !this.popupClosed,
    });

    return (
      <div className={wrapperClasses}>
        <form
          action={'https://hexatope.us17.list-manage.com/subscribe/post?u=4c51e43f1162adc62d41e6ea5&amp;id=7a87ac0c36'}
          method={'post'}
          target={'_blank'}
          className={styles.popupForm}
          noValidate
          onSubmit={this.submitForm}
        >
          <button
            onClick={this.closePopup}
            className={styles.popupCloseButton}
            type={'button'}
          >
            close
          </button>
          <p className={styles.popupHint}>
            Sign up to our newsletter to hear when Hexatope products become available for purchase:
          </p>
          <div className={styles.popupFields}>
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
              onChange={this.onEmailChanged}
              value={this.email}
              className={styles.popupEmailField}
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
            <div className={styles.popupSubmitButtonWrapper}>
              <button
                type={'submit'}
                name={'subscribe'}
                className={styles.popupSubmitButton}
              >
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

NewsletterPopup.propTypes = {
  UIStore: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(NewsletterPopup);
