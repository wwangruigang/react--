import React, { Component } from 'react'
import styles from './index.module.scss'
import { Flex, Toast } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import { getCurrentCity } from '../../utils/city'
import Filter from './components/Filter'
import Affix from '../../components/Affix'
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'
import HouseItem from '../../components/HouseItem'

export class Index extends Component {
  state = {
    cityName: '', // 城市名称
    houseList: null // 房源列表
  }

  // 筛选条件
  filter = {}

  async componentWillMount() {
    const { label, value } = await getCurrentCity()
    this.value = value

    this.setState({
      cityName: label
    })

    // 一刚开始进来，获取第一页的数据 1,20
    this.getHouseListData()

    // 监听 window 的刷新与关闭
    // window.addEventListener('beforeunload',() => {
    //   window.localStorage.setItem('filterData',JSON.stringify(this.filter))
    // })
  }

  // 该函数用于接收子组件 Filter 传递过来的数据
  onFilter = filter => {
    this.filter = filter

    this.getHouseListData()
  }

  /**
   * 获取房源列表数据
   */
  getHouseListData = async (start = 1, end = 20) => {
    Toast.loading('正在加载中...', 0)
    const result = await this.$axios.get('/houses', {
      params: {
        cityId: this.value,
        start,
        end,
        ...this.filter
      }
    })

    // Toast.hide()

    const { count, list } = result.data.body
    if (count > 0) {
      Toast.info(`共查询到 ${count} 套房源`, 1)
    }
    // 赋值
    this.setState({
      count,
      houseList: list
    })
  }

  rowRenderer = ({ key, index, style }) => {
    const { houseList } = this.state
    const item = houseList[index]

    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }

    return (
      <div key={key} style={style}>
        <HouseItem {...item} />
      </div>
    )
  }

  /**
   * 判断某一行是否加载完毕
   */
  isRowLoaded = ({ index }) => {
    return !!this.state.houseList[index]
  }

  /**
   * 加载更多
   * 必须按照官方的demo来 ({ startIndex: number, stopIndex: number })
   */
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async (resolve, reject) => {
      Toast.loading('正在加载中...', 0)
      const result = await this.$axios.get('/houses', {
        // 参数也必须按照后台的要求来
        params: {
          cityId: this.value,
          start: startIndex + 1,
          end: stopIndex,
          ...this.filter
        }
      })

      Toast.hide()

      const { count, list } = result.data.body
      if (count > 0) {
        Toast.info(`共查询到 ${count} 套房源`, 1)
      }
      // 赋值
      this.setState({
        count,
        houseList: [...this.state.houseList, ...list]
      })

      resolve()
    })
  }

  /** 渲染房源列表 */
  renderHouseList = () => {
    /**
     * 注意：rowCount 必须是查询出来的总数，而不是此次加载的数量
     */
    const { count } = this.state
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
        minimumBatchSize={20}
      >
        {({ onRowsRendered }) => (
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight
                    height={height}
                    scrollTop={scrollTop}
                    rowCount={count}
                    onRowsRendered={onRowsRendered}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索栏 */}
        <Flex className={styles.listHeader}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.goBack()}
          ></i>
          <SearchHeader
            className={styles.listSearch}
            cityName={this.state.cityName}
          />
        </Flex>
        {/* 筛选条 */}
        <Affix>
          <Filter onFilter={this.onFilter} />
        </Affix>
        {/* 房源列表 */}
        <div className={styles.houseList}>
          {this.state.houseList && this.renderHouseList()}
        </div>
      </div>
    )
  }
}

export default Index
