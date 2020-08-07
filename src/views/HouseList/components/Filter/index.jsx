import React, { Component } from 'react'
import styles from './index.module.scss'
import { Spring } from 'react-spring/renderprops'

// 导入子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import { getCurrentCity } from '../../../../utils/city'

export class Filter extends Component {
  state = {
    /**
     * 约定，如果值为true就是选中，否则就是不选中
     */
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    openType: '', // 记录当前打开的是哪个类型
    filterData: {}, // 从服务器获取的筛选条件数据
    selectValues: {
      // 存储 FilterPicker 与 FilterMore 中传递过来的数据
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  componentDidMount() {
    this.getFilterData()
  }

  async getFilterData() {
    const { value } = await getCurrentCity()

    const result = await this.$axios.get(`/houses/condition?id=${value}`)

    this.setState({
      filterData: result.data.body
    })
  }

  onTitleChange = type => {
    const { titleSelectedStatus } = this.state

    this.setState(
      {
        openType: type,
        titleSelectedStatus: {
          ...titleSelectedStatus,
          [type]: true
        }
      },
      () => {
        // 重置高亮状态
        this.changeTitleSelectedStatus(type)
      }
    )
  }

  // 最终统计哪个筛选项该高亮，哪个不高亮
  changeTitleSelectedStatus = type => {
    const { titleSelectedStatus, selectValues } = this.state

    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === 'area') {
        titleSelectedStatus[key] = selectValues[key][1] !== 'null'
      } else if (key === 'mode' || key === 'price') {
        titleSelectedStatus[key] = selectValues[key][0] !== 'null'
      } else if (key === 'more') {
        titleSelectedStatus[key] = selectValues[key].length > 0
      }
    })

    // 把type设置为true，这种情况适合点击它的时候
    if (type) {
      titleSelectedStatus[type] = true
    }

    this.setState({
      titleSelectedStatus
    })
  }

  /**
   * 取消的方法
   */
  onCancel = () => {
    this.setState(
      {
        openType: ''
      },
      () => {
        // 处理filterTitle的选中状态
        this.changeTitleSelectedStatus()
      }
    )
  }

  /**
   * 确定的方法
   */
  onSave = (type, value) => {
    const { selectValues } = this.state

    this.setState(
      {
        openType: '',
        selectValues: {
          ...selectValues,
          [type]: value
        }
      },
      () => {
        // 处理filterTitle的选中状态
        this.changeTitleSelectedStatus()

        // todo 把收集到的数据，经过处理，然后传递给HouseList作为查询房源列表的参数
        // * 我们给他设置值之后，要想获取到最新值，需要重新获取一下即可
        const { selectValues } = this.state

        const filter = {}
        // // 处理方式和地铁
        const key = selectValues['area'][0]
        if (selectValues['area'].length === 2) {
          filter[key] = null
        } else if (selectValues['area'].length === 3) {
          filter[key] =
            selectValues['area'][2] === 'null'
              ? selectValues['area'][1]
              : selectValues['area'][2]
        }

        // 处理方式
        filter.rentType = selectValues['mode'][0]
        // 处理租金
        filter.price = selectValues['price'][0]
        // 处理more
        filter.more = selectValues['more'].join(',')

        this.props.onFilter && this.props.onFilter(filter)
      }
    )
  }

  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectValues
    } = this.state

    if (openType === '' || openType === 'more') return null

    // 传递给子组件的data
    let data = null
    let cols = 1
    const defaultValue = selectValues[openType]
    switch (openType) {
      case 'area':
        cols = 3
        data = [area, subway]
        break

      case 'mode':
        data = rentType
        break

      case 'price':
        data = price
        break

      default:
        break
    }

    return (
      <FilterPicker
        defaultValue={defaultValue}
        data={data}
        cols={cols}
        type={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
      />
    )
  }

  // 渲染 filterMore
  renderFilterMore = () => {
    const {
      openType,
      filterData: { roomType, oriented, floor, characteristic },
      selectValues
    } = this.state

    if (openType !== 'more') return null

    // 这个就是FilterMore所需要的筛选数据
    const data = { roomType, oriented, floor, characteristic }

    // 传递默认值给FilterMore
    const defaultValue = selectValues['more']

    return (
      <FilterMore
        data={data}
        defaultValue={defaultValue}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  }

  renderMask = () => {
    const { openType } = this.state

    // if (openType === '' || openType === 'more') return null
    const isHidden = openType === '' || openType === 'more'

    return (
      <Spring to={{ opacity: isHidden ? 0 : 1 }} config={{ duration: 300 }}>
        {props => {
          // console.log(props)
          if (props.opacity === 0) return null
          
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={this.onCancel}
            ></div>
          )
        }}
      </Spring>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 遮罩 */}
        {this.renderMask()}

        {/* 内容 */}
        <div className={styles.content}>
          {/* 过滤条标题组件 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleChange={this.onTitleChange}
          />

          {/* 过滤条的 FilterPicker */}
          {this.renderFilterPicker()}
          {/* 过滤条的 FilterMore */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}

export default Filter
