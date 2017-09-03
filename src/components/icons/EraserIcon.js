import React from 'react';
import PropTypes from 'prop-types';

const EraserIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 100 100' version='1.1' preserveAspectRatio='xMidYMid meet'>
    <title>Eraser icon</title>
    <path d='M90.2 16.5L72.1 2.6C67-1.3 59.9-.3 55.9 4.7L7.6 67.3c-3.9 5-2.9 12.2 2.1 16.1l18.1 13.9c5.1 3.8 12.2 2.9 16.2-2.1l48.3-62.7c3.9-4.9 3-12.1-2.1-16zM41.7 87.2l-3.1 3.9c-1.6 2-4.4 2.4-6.5.8L14 78c-2-1.5-2.4-4.4-.9-6.4l3.1-3.9c.9-1.1 2.2-1.8 3.7-1.8 1 0 2 .3 2.8.9l18.1 13.9c.9.8 1.5 1.9 1.7 3.1.2 1.2-.1 2.4-.8 3.4z' />
  </svg>
);

EraserIcon.propTypes = {
  className: PropTypes.string,
};

export default EraserIcon;
