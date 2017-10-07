import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ className }) => (
  <svg className={className} viewBox='0 0 251 25' version='1.2' preserveAspectRatio='xMidYMid meet'>
    <title>Hexatope Logo</title>
    <path d='M4.5.4v10.1h11.8V.4h4.6v24.1h-4.6V14.1H4.5v10.4H0V.4h4.5zM37.8.4H54L53.5 4H42.4v6.4h9.5v3.5h-9.5V21h11.1l.4 3.6h-16V.4zM106.8 24.5h-4.9L110.4.4h5.4l8.5 24.1h-4.8c-.5-1.4-.9-2.8-1.4-4.3h-9.8l-1.5 4.3zm10-7.7l-3.7-12c-1.2 4-2.4 8-3.7 12h7.4zM145.8 4v20.6h-4.6V4h-7.1V.4h19.1l-.4 3.6h-7zM165.3 12.5c0-7.7 4.4-12.5 11.6-12.5 7.2 0 11.6 4.8 11.6 12.5S184.1 25 176.9 25c-7.1 0-11.6-4.8-11.6-12.5zm18.5 0c0-6-2.9-9-6.8-9s-6.9 3-6.9 9c0 5.9 2.9 8.9 6.9 8.9 3.9 0 6.8-2.9 6.8-8.9zM211.2.4c5.1 0 8.9 2.6 8.9 7.8 0 5.2-3.7 8-8.9 8h-2.7v8.4H204V.4h7.2zm-2.7 12.2h2.8c2.8 0 4.1-1.8 4.1-4.4 0-2.7-1.4-4.2-4.1-4.2h-2.8v8.6zM234.9.4H251l-.5 3.6h-11.2v6.4h9.5v3.5h-9.5V21h11.1l.4 3.6h-16V.4zM80.1 15.3l-12.7 7.4v-4.9l9.3-5-9.3-4.9V3.1L80 10.4c3.9-2.3 8.3-5 12.2-7.2v5l-8.8 4.7 8.8 4.7v4.9l-12.1-7.2z' />
  </svg>
);

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;
