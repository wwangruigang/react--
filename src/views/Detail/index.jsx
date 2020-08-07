import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import HousePackage from '../../components/HousePackage'
import HouseItem from '../../components/HouseItem'
import { getToken } from '../../utils/token'

const BMap = window.BMap

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    houseCode: '5cc477061439630e5b467b0b',
    houseImg: '/newImg/7bk83o0cf.jpg',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    houseCode: '5cc4a1dd1439630e5b502266',
    houseImg: '/newImg/7bk83o0cf.jpg',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    houseCode: '5cc46a921439630e5b439611',
    houseImg: '/newImg/7bk83o0cf.jpg',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

const labelStyle = {
  position: 'absolute',
  zIndex: -1,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

class Detail extends Component {
  constructor() {
    super()

    this.state = {
      imgHeight: 252, //轮播图容器的高度
      houseInfo: {
        community: '' // 小区名字
      },
      isFavorite: false // 是否收藏 true 已收藏 false 没有收藏
    }
  }

  componentDidMount() {
    this.getHouseInfoData()

    // 获取该房源的收藏状态
    this.getFavoriteStatus()
  }

  // 获取房屋数据
  getHouseInfoData = async () => {
    const result = await this.$axios.get(
      `/houses/${this.props.match.params.id}`
    )

    this.setState(
      {
        houseInfo: result.data.body
      },
      () => {
        // 初始化地图
        this.initMap()
      }
    )
  }

  // 获取房屋收藏状态
  getFavoriteStatus = async () => {
    const result = await this.$axios.get(
      `/user/favorites/${this.props.match.params.id}`
    )

    if (result.data.status === 200) {
      this.setState({
        isFavorite: result.data.body.isFavorite
      })
    }
  }

  // 渲染轮播图
  renderCarousel = () => {
    const {
      houseInfo: { houseImg }
    } = this.state
    return (
      <Carousel autoplay infinite>
        {houseImg.map(val => (
          <a
            key={val}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`${BASE_URL}${val}`}
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

  // 渲染房屋信息
  renderHouseInfo = () => {
    const {
      houseInfo: { title, tags, price, roomType, size, floor, oriented }
    } = this.state
    return (
      <div className={styles.info}>
        <h3 className={styles.infoTitle}>{title}</h3>
        <Flex>
          {tags &&
            tags.map((item, index) => {
              const tagName = `tag${(index % 3) + 1}`
              return (
                <span
                  key={index}
                  className={[styles.tag, styles[tagName]].join(' ')}
                >
                  {item}
                </span>
              )
            })}
        </Flex>
        <Flex className={styles.infoPrice}>
          <Flex.Item className={styles.infoPriceItem}>
            <div>
              {price}
              <span className={styles.month}>/月</span>
            </div>
            <div>租金</div>
          </Flex.Item>
          <Flex.Item className={styles.infoPriceItem}>
            <div>{roomType}</div>
            <div>房型</div>
          </Flex.Item>
          <Flex.Item className={styles.infoPriceItem}>
            <div>{size}</div>
            <div>面积</div>
          </Flex.Item>
        </Flex>
        <Flex className={styles.infoBasic} align="center">
          <Flex.Item>
            <div>
              <span className={styles.title}>装修：</span>
              精装修
            </div>
            <div>
              <span className={styles.title}>楼层：</span>
              {floor}
            </div>
          </Flex.Item>
          <Flex.Item>
            <div>
              <span className={styles.title}>朝向：</span>
              {oriented.join(' ')}
            </div>
            <div>
              <span className={styles.title}>类型：</span>普通住宅
            </div>
          </Flex.Item>
        </Flex>
      </div>
    )
  }

  // 渲染地图的div
  renderMap = () => {
    return (
      <div className={styles.map}>
        <div className={styles.mapTitle}>
          小区：{this.state.houseInfo.community}
        </div>
        <div id="container" className={styles.mapContainer}></div>
      </div>
    )
  }

  // 初始化地图及创建覆盖物
  initMap = () => {
    const {
      houseInfo: {
        community,
        coord: { latitude, longitude }
      }
    } = this.state

    // 创建地图实例
    var map = new BMap.Map('container')

    // 创建中心点
    var point = new BMap.Point(longitude, latitude)

    // 设置中心点和地图缩放级别
    map.centerAndZoom(point, 17)

    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(0, -36) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象
    // 设置label的样式
    label.setStyle(labelStyle)
    // 设置label的内容
    label.setContent(`
        <span>${community}</span>
        <div class="${styles.mapArrow}"></div>
    `)

    // 把覆盖物添加到地图上
    map.addOverlay(label)
  }

  // 渲染房屋配套
  renderSupporting = () => {
    const {
      houseInfo: { supporting }
    } = this.state

    return (
      <div className={styles.about}>
        <div className={styles.houseTitle}>房屋配套</div>
        {supporting.length > 0 ? (
          <HousePackage list={supporting} />
        ) : (
          <div>暂无配套</div>
        )}
      </div>
    )
  }

  // 渲染房屋概况
  renderDescription = () => {
    return (
      <div className={styles.set}>
        <div className={styles.houseTitle}>房屋概况</div>
        <div>
          <div className={styles.contact}>
            <div className={styles.user}>
              <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
              <div className={styles.useInfo}>
                <div>王女士</div>
                <div className={styles.userAuth}>
                  <i className="iconfont icon-auth" />
                  已认证房主
                </div>
              </div>
            </div>
            <span className={styles.userMsg}>发消息</span>
          </div>

          <div className={styles.descText}>
            {this.state.houseInfo.description || '暂无房屋描述'}
            {/* 1.周边配套齐全，地铁四号线陶然亭站，交通便利，公交云集，距离北京南站、西站都很近距离。
              2.小区规模大，配套全年，幼儿园，体育场，游泳馆，养老院，小学。
              3.人车分流，环境优美。
              4.精装两居室，居家生活方便，还有一个小书房，看房随时联系。 */}
          </div>
        </div>
      </div>
    )
  }

  // 渲染猜你喜欢
  renderRecommendHouses = () => {
    return (
      <div className={styles.recommend}>
        <div className={styles.houseTitle}>猜你喜欢</div>
        <div className={styles.items}>
          {recommendHouses.map(item => {
            return <HouseItem key={item.houseCode} {...item} />
          })}
        </div>
      </div>
    )
  }

  // 收藏与取消收藏
  toggleFavorite = async () => {
    // 判断是否登录，如果登录了，就去执行收藏与取消收藏，如果没有登录，先去登录
    if (!getToken()) {
      Modal.alert('提示', '登录后才能收藏房源,是否去登录?', [
        { text: '取消', onPress: null },
        {
          text: '去登录',
          onPress: () => this.props.history.push('/login')
        }
      ])
      return
    }

    // 执行收藏与取消收藏
    const { isFavorite } = this.state
    if (isFavorite) {
      // 之前是收藏的，则取消收藏
      const result = await this.$axios.delete(
        `/user/favorites/${this.props.match.params.id}`
      )

      if (result.data.status === 200) {
        Toast.info('取消收藏成功')
      }
    } else {
      // 之前没有收藏，则收藏
      const result = await this.$axios.post(
        `/user/favorites/${this.props.match.params.id}`
      )
      if (result.data.status === 200) {
        Toast.info('收藏成功')
      }
    }

    this.setState({
      isFavorite: !isFavorite
    })
  }

  // 渲染底部
  renderFooter = () => {
    const { isFavorite } = this.state
    return (
      <Flex className={styles.fixedBottom}>
        <Flex.Item onClick={this.toggleFavorite}>
          {isFavorite ? (
            <>
              <img
                src="http://localhost:8080/img/star.png"
                className={styles.favoriteImg}
                alt="收藏"
              />
              <span className={styles.favorite}>已收藏</span>
            </>
          ) : (
            <>
              <img
                src="http://localhost:8080/img/unstar.png"
                className={styles.favoriteImg}
                alt="收藏"
              />
              <span className={styles.favorite}>收藏</span>
            </>
          )}
        </Flex.Item>
        <Flex.Item>在线咨询</Flex.Item>
        <Flex.Item>
          <a href="tel:18688888888" className={styles.telephone}>
            电话预约
          </a>
        </Flex.Item>
      </Flex>
    )
  }

  render() {
    const { houseInfo } = this.state
    return (
      <div className={styles.root}>
        {/* 渲染 NavHeader */}
        <NavHeader
          className={styles.detailHeader}
          rightContent={[<i className="iconfont icon-share" key="share" />]}
        >
          {houseInfo.community}
        </NavHeader>
        {/* 渲染轮播图 */}
        {houseInfo.houseImg && this.renderCarousel()}
        {/* 渲染房屋详情信息 */}
        {houseInfo.title && this.renderHouseInfo()}
        {/** 渲染地图 */}
        {this.renderMap()}
        {/* 渲染房屋配套 */}
        {houseInfo.supporting && this.renderSupporting()}
        {/* 渲染房屋概况 */}
        {this.renderDescription()}
        {/* 渲染猜你喜欢 */}
        {this.renderRecommendHouses()}
        {/* 渲染底部 */}
        {this.renderFooter()}
      </div>
    )
  }
}

export default Detail
