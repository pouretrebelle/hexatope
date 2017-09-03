import React from 'react';
import PropTypes from 'prop-types';

const PencilIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 100 100' version='1.1' preserveAspectRatio='xMidYMid meet'>
    <title>Pencil icon</title>
    <path d='M41.5 87.9c4-4 6-9.2 6.1-14.6l49.4-55c3.8-4.3 3.6-10.8-.4-14.8C92.5-.6 86-.8 81.8 3.1L26.7 52.3c-5.2 0-10.5 2-14.6 6.1C4.9 65.8 1.1 92.1.7 95l-.5 4.7 4.7-.5c2.9-.3 29.2-4.1 36.6-11.3zM86.6 8.3C88 7 90.2 7 91.5 8.5c1.4 1.4 1.4 3.6.2 4.9l-46 51.2c-1.1-2.2-2.3-4.3-4.1-6.1s-4-3.2-6.1-4.1L86.6 8.3z' />
  </svg>
);

PencilIcon.propTypes = {
  className: PropTypes.string,
};

export default PencilIcon;
