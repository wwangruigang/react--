import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader/'
import styles from './index.module.scss'
import HouseItem from '../../components/HouseItem'
import { Toast } from 'antd-mobile'

class Rent extends Component {
  state = {
    houseList: []
  }

  componentDidMount() {
    this.getHouseListData()
  }

  getHouseListData = async () => {
    Toast.loading('正在加载中...', 0)
    const result = await this.$axios.get('/user/houses')
    Toast.hide()

    this.setState({
      houseList: result.data.body
    })
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader>我的出租列表</NavHeader>

        <div className={styles.houses}>
          {this.state.houseList.map(item => {
            return <HouseItem key={item.houseCode} {...item} />
          })}
        </div>
      </div>
    )
  }
}

export default Rent
