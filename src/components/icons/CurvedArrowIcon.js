import React from 'react';
import PropTypes from 'prop-types';

const CurvedArrowIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 90 90' version='1.1' preserveAspectRatio='xMidYMid meet'>
    <title>Curved Arrow icon</title>
    <path d='M82,34.6L82,34.6L82,34.6z'/>
    <path d='M88.5,31.6l-6.5,3l-6.8-14.8C68,48.4,54,64.6,40.1,73.4C25.3,82.7,10.9,83.8,4.7,83.8c-1.9,0-3.1-0.1-3.2-0.1l0.7-7.1h0 c0,0,0,0,0.1,0c0.3,0,1.1,0.1,2.4,0.1c5.3,0,18.4-1,31.5-9.3c12.4-7.9,25.2-22.2,32.1-49.4l-14.6,6.6L50.8,18l26-11.8L88.5,31.6z'/>
  </svg>
);

CurvedArrowIcon.propTypes = {
  className: PropTypes.string,
};

export default CurvedArrowIcon;
