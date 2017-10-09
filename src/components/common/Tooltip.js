import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Tooltip.sass';

const Tooltip = ({ direction, label, children }) => {
  const tooltipClasses = classNames({
    [styles.tooltip]: true,
    [styles.tooltipUp]: direction == 'up',
    [styles.tooltipDown]: direction == 'down',
  });

  return (
    <div className={styles.tooltipWrapper} tabIndex={0}>
      <div className={tooltipClasses}>
        {label}
      </div>
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  direction: PropTypes.string,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  direction: 'up',
};

export default Tooltip;
