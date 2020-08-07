import React, { Component } from 'react'
import styles from './index.module.scss'
import FilterFooter from '../FilterFooter'
import classNames from 'classnames'

export class FilterMore extends Component {
  state = {
    selectValues: this.props.defaultValue
  }

  toggle = value => {
    let { selectValues } = this.state

    // 此次点击的 value 在数组中了
    if (selectValues.includes(value)) {
      selectValues = selectValues.filter(item => item !== value)
    } else {
      // 不在
      selectValues.push(value)
    }

    // 更新
    this.setState({
      selectValues
    })
  }

  renderItem = data => {
    const { selectValues } = this.state
    return (
      <div>
        {data.map(item => {
          // 判断遍历的每一项是否应该添加高亮效果
          const isSelect = selectValues.includes(item.value)
          return (
            <span
              key={item.value}
              className={classNames(styles.tag, {
                [styles.tagActive]: isSelect
              })}
              onClick={() => this.toggle(item.value)}
            >
              {item.label}
            </span>
          )
        })}
      </div>
    )
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      onSave,
      onCancel
    } = this.props
    return (
      <div className={styles.root}>
        {/* 渲染遮罩层 */}
        <div className={styles.mask} onClick={onCancel}></div>
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderItem(roomType)}</dd>
            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderItem(oriented)}</dd>
            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderItem(floor)}</dd>
            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderItem(characteristic)}</dd>
          </dl>
        </div>
        <div className={styles.footer}>
          <FilterFooter
            cancelText="清除"
            onCancel={() => this.setState({ selectValues: [] })}
            onSave={() => onSave('more', this.state.selectValues)}
          />
        </div>
      </div>
    )
  }
}

export default FilterMore
