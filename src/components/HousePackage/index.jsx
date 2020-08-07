import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import classNames from 'classnames'

// 所有房屋配置项
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]

class HousePackage extends Component {
  state = {
    selectedValues: []
  }

  toggleSelect = value => {
    if (!this.props.select) return

    let newSelectValues = [...this.state.selectedValues]
    if (newSelectValues.includes(value)) {
      newSelectValues = newSelectValues.filter(item => item.id !== value.id)
    } else {
      newSelectValues.push(value)
    }

    this.setState({
      selectedValues: newSelectValues
    },() => {
      // 每次选择完毕之后，把值传递给父组件(RentAdd)
      this.props.onSelect && this.props.onSelect(this.state.selectedValues)
    })
  }

  renderItems = () => {
    let data = null
    if (this.props.list) {
      data = HOUSE_PACKAGE.filter(item => this.props.list.includes(item.name))
    } else {
      data = HOUSE_PACKAGE
    }

    // 根据筛选出来的数据，遍历生成房屋配套项
    return data.map(item => {
      return (
        <li
          key={item.id}
          className={classNames(styles.item, {
            [styles.active]: this.state.selectedValues.includes(item)
          })}
          onClick={() => this.toggleSelect(item)}
        >
          <p>
            <i className={`iconfont ${item.icon} ${styles.icon}`}></i>
          </p>
          {item.name}
        </li>
      )
    })
  }

  render() {
    return <ul className={styles.root}>{this.renderItems()}</ul>
  }
}

HousePackage.propTypes = {
  list: PropTypes.array,
  select: PropTypes.bool
}

HousePackage.defaultProps = {
  select: false
}

export default HousePackage
