import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'
import classNames from 'classnames'

function NavHeader({ history, className, children, rightContent }) {
  return (
    <NavBar
      className={classNames(styles.navBar, className)}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.goBack()}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default withRouter(NavHeader)
