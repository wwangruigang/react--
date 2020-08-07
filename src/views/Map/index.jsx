import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils/city'
import { Toast } from 'antd-mobile'
import classNames from 'classnames'
// 导入子组件
import HouseItem from '../../components/HouseItem'

// 先把BMap从window中取出来
const BMap = window.BMap

// label 样式：
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

class Map extends Component {
  state = {
    isShowHouseList: false, // 是否显示房源列表
    houseList: [] // 房源列表
  }

  componentDidMount() {
    this.initMap()
  }

  componentWillUnmount() {
    this.map.removeEventListener('touchmove', () => {})
  }

  initMap = async () => {
    // 获取到定位城市的名字
    const { label, value } = await getCurrentCity()

    // 创建地图实例
    var map = new BMap.Map('container')
    this.map = map

    this.map.addEventListener('touchmove', () => {
      this.setState({
        isShowHouseList: false
      })
    })

    // 设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915)

    // 显示出来（必须要有中心点和缩放级别）
    // map.centerAndZoom(label, 11)

    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11)
          //   map.addOverlay(new BMap.Marker(point)) // 添加一个覆盖物

          // 添加控件【可选】
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())

          // 开始渲染覆盖物(渲染第一级)
          this.renderOverlays(value)
        }
      },
      label
    )
  }

  /**
   * 获取当前的地图级别，然后决定渲染什么类型的覆盖物（圆形和方形）
   * 并且还需要知道点击当前覆盖物之后，下一个级别的地图级别是多少
   */
  getTypeAndNextZoom = () => {
    let type, nextZoom

    const zoom = this.map.getZoom()
    if ((zoom > 10) & (zoom < 12)) {
      // 渲染第一级覆盖物
      type = 'circle'
      nextZoom = 13
    } else if ((zoom > 12) & (zoom < 14)) {
      // 渲染第二级覆盖物
      type = 'circle'
      nextZoom = 15
    } else {
      // 渲染第三级覆盖物
      type = 'rect'
    }

    return {
      type,
      nextZoom
    }
  }

  renderOverlays = async id => {
    // 发送网络请求，获取数据
    Toast.loading('拼命加载中...', 0)
    const result = await this.$axios.get(`/area/map?id=${id}`)
    Toast.hide()

    // 确定我们地图的渲染的样子和点击之后的缩放级别
    const { type, nextZoom } = this.getTypeAndNextZoom()

    result.data.body.forEach(item => {
      if (type === 'circle') {
        this.createCircleOverlays(item, nextZoom)
      } else {
        this.createRectOverlays(item)
      }
    })
  }

  /**
   * 这个方法给一二级地图覆盖物使用
   */
  createCircleOverlays = (item, nextZoom) => {
    const {
      label: name,
      value: id,
      count,
      coord: { latitude, longitude }
    } = item

    // 创建覆盖物的点
    var point = new BMap.Point(longitude, latitude)

    // 创建选项
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(30, -30) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象

    // 设置label的样式
    label.setStyle(labelStyle)

    // 设置内容
    label.setContent(`
      <div class=${styles.bubble}>
        <p class=${styles.name}>${name}</p>
        <p class=${styles.name}>${count}套</p>
      </div>  
    `)

    // 添加点击事件
    label.addEventListener('click', () => {
      // 清除所有的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 重置中心点和地图级别
      this.map.centerAndZoom(point, nextZoom)

      // 加载下一级的覆盖物，并且渲染
      this.renderOverlays(id)
    })

    // 添加到地图地图上
    this.map.addOverlay(label)
  }

  /**
   * 这个方法是给三级那个小区覆盖物使用的
   */
  createRectOverlays = item => {
    const {
      label: name,
      value: id,
      count,
      coord: { latitude, longitude }
    } = item

    // 创建覆盖物的点
    var point = new BMap.Point(longitude, latitude)

    // 创建选项
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -20) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象

    // 设置label的样式
    label.setStyle(labelStyle)

    // 设置内容
    label.setContent(`<div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}套</span>
        <i class='iconfont icon-arrow ${styles.arrow}'/>
    <div>`)

    label.addEventListener('click', e => {
      if (!e || !e.changedTouches) return

      const { clientX, clientY } = e.changedTouches[0]
      const moveX = window.innerWidth / 2 - clientX
      const moveY = (window.innerHeight - 330 + 45) / 2 - clientY

      // 在地图上平移 x 和 y 像素
      this.map.panBy(moveX, moveY)

      // 显示房源列表面板
      this.setState({
        isShowHouseList: true
      })

      // 发送请求，获取房源列表
      this.getHouseListById(id)
    })

    // 添加到地图上
    this.map.addOverlay(label)
  }

  getHouseListById = async id => {
    Toast.loading('拼命加载中...', 0)
    const result = await this.$axios.get(`/houses?cityId=${id}`)
    Toast.hide()

    this.setState({
      houseList: result.data.body.list
    })
  }

  /** 
  renderOverlays = async () => {
    // 发送网络请求，获取数据
    Toast.loading('拼命加载中...')
    const result = await this.$axios.get(`/area/map?id=${this.value}`)
    Toast.hide()

    // 添加第一级覆盖物
    result.data.body.forEach(item => {
      const {
        label: name,
        value,
        count,
        coord: { latitude, longitude }
      } = item
      // 每一个数据，就是要添加一个覆盖物,参考：http://lbsyun.baidu.com/jsdemo.htm#c1_14
      // 根据经纬度创建点
      var point = new BMap.Point(longitude, latitude)

      // 创建选项
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(35, -35) //设置文本偏移量
      }

      var label = new BMap.Label('', opts) // 创建文本标注对象
      // 设置label的样式
      label.setStyle(labelStyle)
      // 设置内容
      label.setContent(`
        <div class=${styles.bubble}>
          <p class=${styles.name}>${name}</p>
          <p class=${styles.name}>${count}套</p>
        </div>
      `)
      // 给label添加事件
      label.addEventListener('click', () => {
        //1、清除掉所有的覆盖物
        setTimeout(() => {
          this.map.clearOverlays()
        }, 0)

        //2、重置地图的中心点和缩放级别
        this.map.centerAndZoom(point, 13)

        //3、发请求
        Toast.loading('拼命加载中...')
        this.$axios.get(`/area/map?id=${value}`).then(res => {
          Toast.hide()

          // 循环渲染二级覆盖物
          res.data.body.forEach(item => {
            const {
              label: name,
              value,
              count,
              coord: { latitude, longitude }
            } = item
            // 每一个数据，就是要添加一个覆盖物,参考：http://lbsyun.baidu.com/jsdemo.htm#c1_14
            // 根据经纬度创建点
            var point = new BMap.Point(longitude, latitude)

            // 创建选项
            var opts = {
              position: point, // 指定文本标注所在的地理位置
              offset: new BMap.Size(35, -35) //设置文本偏移量
            }

            var label = new BMap.Label('', opts) // 创建文本标注对象
            // 设置label的样式
            label.setStyle(labelStyle)
            // 设置内容
            label.setContent(`
              <div class=${styles.bubble}>
                <p class=${styles.name}>${name}</p>
                <p class=${styles.name}>${count}套</p>
              </div>
            `)
            // 添加到地图上
            this.map.addOverlay(label)
          })
        })
      })
      // 添加到地图上
      this.map.addOverlay(label)
    })
  }
  */

  renderHouseList = () => {
    const { isShowHouseList, houseList } = this.state
    // return <div className={classNames(styles.houseList,{[styles.show]:isShowHouseList})}>
    return (
      // <div
      //   className={[styles.houseList, isShowHouseList ? styles.show : ''].join(
      //     ' '
      //   )}
      // >
      <div
        className={classNames(styles.houseList, {
          [styles.show]: isShowHouseList
        })}
      >
        <div className={styles.titleWrap}>
          <div className={styles.listTitle}>房屋列表</div>
          <div className={styles.titleMore}>更多房源</div>
        </div>
        <div className={styles.houseItems}>
          {houseList.map(item => {
            return <HouseItem key={item.houseCode} {...item} />
          })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 导航条 */}
        <NavHeader>地图找房</NavHeader>
        {/* 显示地图的地方 */}
        <div id="container"></div>
        {/* 渲染房源列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map
