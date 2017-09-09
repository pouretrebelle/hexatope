import React, { Component } from 'react';
import 'whatwg-fetch';
import styles from './Mailchimp.sass';

class Mailchimp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: undefined,
    };
  }

  onEmailInputChanged = (e) => {
    console.log('change');

    this.setState({
      email: e.target.value,
    });
  }

  onSubmit = (e) => {
    // stop http post request
    e.preventDefault();

    const url = e.target.action;

    const data = {
      email: this.state.email,
    };
    console.log(data);
    console.log(fetch);

    fetch(url, {
      method: 'POST',
      body: data,
    }).then((response) => {
      console.log('success', response);
    }).catch((response) => {
      console.log('failure', response);
    });
    console.log('submit!');
    console.log(e);
  }

  render() {
    return (
      <div className={styles.mailchimp} id={'mc_embed_signup'}>
        <form action={'//hexatope.us16.list-manage.com/subscribe/post-json?u=b44ddb5ee5db94aa4c227ba86&id=83f7e3a7ef'} method={'post'} id={'mc-embedded-subscribe-form'} name={'mc-embedded-subscribe-form'} className={'validate'} onSubmit={this.onSubmit}>
          <div className='mc-field-group'>
            <label htmlFor='mce-EMAIL'>Email Address</label>
            <input type='email' value='' name='EMAIL' className='required email' id='mce-EMAIL' onChange={this.onEmailInputChanged} value={this.state.email} />
          </div>
          <div id='mce-responses' className='clear'>
            <div className='response' id='mce-error-response' style={{ display: 'none' }}></div>
            <div className='response' id='mce-success-response' style={{ display: 'none' }}></div>
          </div>
          <div style={{ position: 'absolute', left: -5000 }} aria-hidden='true'>
            <input type='text' name='b_b44ddb5ee5db94aa4c227ba86_83f7e3a7ef' tabIndex='-1' value=''/>
          </div>
          <button type='submit' className='button'>
            Subscribe
          </button>
        </form>
      </div>
    );
  }
}


export default Mailchimp;
