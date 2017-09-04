import React from 'react';
import PropTypes from 'prop-types';

const RotateIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 100 100' version='1.1' preserveAspectRatio='xMidYMid meet'>
    <title>Rotate icon</title>
    <path d='M78 93.1c-5.2 3-12.3 6-19.2 7-.4-3.2-.7-5.7-1.1-9l3-.6c4.3-.9 9-2.5 12.2-4.7 1.5 2.3 3.4 5 5.1 7.3zM86 87.2c-2.2-2.3-4-4.1-6.3-6.5l2-2.3c2.8-3.3 5.6-7.4 6.8-11.1 2.7.9 5.8 1.9 8.5 2.7-2.3 5.6-6.2 12.2-11 17.2zM97.7 40.2c1.5 5.8 2.5 13.4 1.6 20.3-3.1-.5-5.7-.8-9-1.3l.3-3c.3-4.3 0-9.3-1.3-13 2.7-.9 5.8-2 8.4-3zM89.8 33.2l-3.9 2.2-1.1-1.6C79 25.9 70.2 19.7 62.2 18.3l-2.2-.4v9.4l-11.2-6.6c-6.2-3.6-11.1-6.8-11-7.1.1-.3 5.1-3.4 11.2-7L60 .1v8.4l4.6 1c10.9 2.4 21.1 9.6 27.6 19.3l1.5 2.3-3.9 2.1zM38.4 32.4l20.9 20-6.9 28.1-27.8 8.1-20.9-20 6.9-28.1z' />
  </svg>
);

RotateIcon.propTypes = {
  className: PropTypes.string,
};

export default RotateIcon;
