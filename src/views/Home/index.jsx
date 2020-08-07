import React, { Component } from 'react'

import { TabBar } from 'antd-mobile'

import { Route } from 'react-router-dom'

// 导入子组件
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

// 导入样式
import styles from './index.module.scss'

class Home extends Component {
  constructor(props) {
    super()

    this.state = {
      selectedTab: props.location.pathname
    }
  }

  // tabs数组
  TABS = [
    {
      title: '首页',
      icon: 'icon-index',
      path: '/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/list'
    },
    {
      title: '资讯',
      icon: 'icon-info',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
  ]

  // 方式2
  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  // 渲染TabBar
  renderTabBar = () => {
    return (
      <TabBar tintColor="#21B97A" noRenderContent>
        {this.TABS.map(item => {
          return (
            <TabBar.Item
              icon={<i className={`iconfont ${item.icon}`}></i>}
              selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
              title={item.title}
              key={item.path}
              selected={this.state.selectedTab === item.path}
              onPress={() => {
                // 方式1
                // this.setState({
                //   selectedTab: item.path
                // })

                // 通过编程式导航实现页面切换
                if (this.props.location.pathname !== item.path) {
                  this.props.history.push(item.path)
                }
              }}
            ></TabBar.Item>
          )
        })}
      </TabBar>
    )
  }

  render () {
    return (
      <div className={styles.home}>
        {/* 路由切换部分 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />
        {/* tabBar */}
        <div className={styles.tabbar}>{this.renderTabBar()}</div>
      </div>
    )
  }
}

export default Home
