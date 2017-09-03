import React from 'react';
import PropTypes from 'prop-types';

const ClearIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 100 100' version='1.1' preserveAspectRatio='xMidYMid meet'>
    <title>Clear icon</title>
    <path d='M96.9 37.8c-2-4.2-11.4-17.8-15.7-26.3C79.9 8.9 78 7.2 76 7.2H24.7c-2 0-3.9 1.7-5.2 4.3C15.2 20 5.8 33.6 3.8 37.8 1.4 43 .2 46.9.7 52.4s2.3 26.7 2.8 31 3.4 9.4 6.2 9.4H91c2.8 0 5.8-5.2 6.2-9.4.4-4.2 2.3-25.4 2.8-30.9s-.6-9.4-3.1-14.7zm-26.3 4.7c-.5 0-1 .5-1.2 1.3l-4.1 18.8H35.4l-4.1-18.8c-.2-.8-.7-1.3-1.2-1.3H12.5l10.2-20.2h55.4l10.2 20.2H70.6zm-4.7 38.9h-31c-.4 0-.7-.3-.7-.7v-6.2c0-.4.3-.7.7-.7h30.9c.4 0 .7.3.7.7v6.2c0 .4-.3.7-.6.7z' />
  </svg>
);

ClearIcon.propTypes = {
  className: PropTypes.string,
};

export default ClearIcon;
