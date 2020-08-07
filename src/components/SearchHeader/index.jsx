import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import { withRouter } from 'react-router'
import { Flex } from 'antd-mobile'
import classNames from 'classnames'

function SearchHeader({ cityName, className, history }) {
  return (
    <div className={classNames(styles.root, className)}>
      <Flex>
        <Flex className={styles.searchLeft}>
          <div
            onClick={() => history.push('/citylist')}
            className={styles.location}
          >
            <span>{cityName}</span>
            <i className="iconfont icon-arrow"></i>
          </div>
          <div className={styles.searchForm}>
            <i className="iconfont icon-search"></i>
            <span>请输入小区或地址</span>
          </div>
        </Flex>
        <i
          onClick={() => history.push('/map')}
          className="iconfont icon-map"
        ></i>
      </Flex>
    </div>
  )
}

SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default withRouter(SearchHeader)
