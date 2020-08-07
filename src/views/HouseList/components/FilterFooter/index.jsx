import React from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import classNames from 'classnames'
import PropTypes from 'prop-types'

function FilterFooter({ cancelText, onCancel, onSave }) {
  return (
    <Flex className={styles.root}>
      <span
        className={classNames(styles.btn, styles.cancel)}
        onClick={onCancel}
      >
        {cancelText}
      </span>
      <span className={classNames(styles.btn, styles.ok)} onClick={onSave}>
        确定
      </span>
    </Flex>
  )
}

FilterFooter.defaultProps = {
  cancelText: '取消'
}

FilterFooter.propTypes = {
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default FilterFooter
