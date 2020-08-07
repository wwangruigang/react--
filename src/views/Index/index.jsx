import React, { Component } from 'react'

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'

import styles from './index.module.scss'

import { BASE_URL } from '../../utils/url'

// 加载导航菜单所需要的图片
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

import { Link } from 'react-router-dom'

// 导入子组件
import SearchHeader from '../../components/SearchHeader'

import { getCurrentCity } from '../../utils/city'

export class Index extends Component {
  constructor() {
    super()

    this.state = {
      imgHeight: 212, // 轮播图的高度
      isLoadingSwiper: true, // 正在加载轮播图
      swipers: [], // 轮播图数据
      groups: [], // 租房小组数据
      news: [], // 新闻数组
      cityName: '深圳' // 定位城市的名字
    }
  }

  navs = [
    { icon: image1, text: '整租', path: '/home/list' },
    { icon: image2, text: '合租', path: '/home/list' },
    { icon: image3, text: '地图找房', path: '/map' },
    { icon: image4, text: '去出租', path: '/rent/add' }
  ]

  componentDidMount() {
    // 获取定位城市，并且设置
    this.getLocationCity()

    this.getSwipersData()

    this.getGroupsData()

    this.getNewsData()
  }

  // 获取定位城市并且设置
  async getLocationCity() {
    const { label } = await getCurrentCity()

    this.setState({
      cityName: label
    })
  }

  // 获取轮播图数据
  async getSwipersData() {
    const result = await this.$axios.get('/home/swiper')

    this.setState({
      isLoadingSwiper: false,
      swipers: result.data.body
    })
  }

  // 获取租房小组的数据
  async getGroupsData() {
    const result = await this.$axios.get(
      '/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      groups: result.data.body
    })
  }

  // 获取新闻数据
  async getNewsData() {
    const result = await this.$axios.get(
      '/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: result.data.body
    })
  }

  /**
   * 渲染轮播图
   */
  renderSwiper = () => {
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`${BASE_URL}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  /**
   * 渲染导航菜单
   */
  renderNavs = () => {
    return (
      <Flex className={styles.nav}>
        {this.navs.map(item => {
          return (
            <Flex.Item key={item.text}>
              <Link to={item.path}>
                <img src={item.icon} alt="" />
                <p>{item.text}</p>
              </Link>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  /**
   * 渲染租房小组
   */
  renderGroups = () => {
    return (
      <div className={styles.groups}>
        <Flex justify="between">
          <Flex.Item>
            <span className={styles.title}>租房小组</span>
          </Flex.Item>
          <Flex.Item align="end">
            <span>更多</span>
          </Flex.Item>
        </Flex>
        {/* 九宫格 */}
        <Grid
          data={this.state.groups}
          columnNum={2}
          hasLine={false}
          square={false}
          renderItem={dataItem => {
            return (
              <div className={styles.navItem}>
                <div className={styles.left}>
                  <p>{dataItem.title}</p>
                  <p>{dataItem.desc}</p>
                </div>
                <div className={styles.right}>
                  <img src={`${BASE_URL}${dataItem.imgSrc}`} alt="" />
                </div>
              </div>
            )
          }}
        ></Grid>
      </div>
    )
  }

  /**
   * 渲染新闻数据
   */
  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新咨询</h3>
        {this.state.news.map(item => {
          return (
            <WingBlank className={styles.newsItem} size="md" key={item.id}>
              <div className={styles.imgWrap}>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </div>
              <Flex
                className={styles.content}
                direction="column"
                justify="between"
              >
                <h3 className={styles.title}>{item.title}</h3>
                <Flex className={styles.info} direction="row" justify="between">
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </WingBlank>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 渲染搜索组件 */}
        <SearchHeader cityName={this.state.cityName} />
        {/* 渲染轮播图 */}
        <div className={styles.swiper}>
          {!this.state.isLoadingSwiper && this.renderSwiper()}
        </div>
        {/* 渲染导航菜单 */}
        {this.renderNavs()}
        {/* 渲染租房小组 */}
        {this.renderGroups()}
        {/* 渲染新闻数据 */}
        {this.renderNews()}
      </div>
    )
  }
}

export default Index
