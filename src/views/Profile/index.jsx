import React, { Component } from 'react'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import { Button, Grid, Toast, Modal } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { removeToken } from '../../utils/token'

const alert = Modal.alert

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', icon: 'icon-coll', to: '/' },
  { id: 2, name: '我的出租', icon: 'icon-index', to: '/rent' },
  { id: 3, name: '看房记录', icon: 'icon-record', to: '/' },
  {
    id: 4,
    name: '成为房主',
    icon: 'icon-identity',
    to: '/'
  },
  { id: 5, name: '个人资料', icon: 'icon-myinfo', to: '/' },
  { id: 6, name: '联系我们', icon: 'icon-cust', to: '/' }
]

export class Index extends Component {
  state = {
    userInfo: {
      avatar: '/img/avatar.png',
      nickname: '游客'
    },
    isLogin: false
  }

  componentDidMount() {
    this.getUserInfoData()
  }

  async getUserInfoData() {
    Toast.loading('数据加载中...', 0)
    const result = await this.$axios.get('/user')
    Toast.hide()

    const { status, body } = result.data

    if (status === 200) {
      this.setState({
        userInfo: body,
        isLogin: true
      })
    }
  }

  logout = () => {
    alert('提示', '确认退出吗?', [
      { text: '取消', onPress: () => {} },
      {
        text: '确定',
        onPress: async () => {
          // 调用api实现退出功能
          await this.$axios.post('/user/logout')

          // 重置当前的模型
          this.setState({
            userInfo: {
              avatar: '/img/avatar.png',
              nickname: '游客'
            },
            isLogin: false
          })

          // 删除token
          removeToken()
        }
      }
    ])
  }

  render() {
    const {
      userInfo: { avatar, nickname },
      isLogin
    } = this.state
    return (
      <>
        <div className={styles.title}>
          <img
            src={`${BASE_URL}/img/profile/bg.png`}
            className={styles.bg}
            alt=""
          />
          <div className={styles.info}>
            <img
              src={`${BASE_URL}${avatar}`}
              className={styles.myIcon}
              alt=""
            />
            <div className={styles.user}>
              <div className={styles.name}>{nickname}</div>
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    <span>编辑个人资料</span>
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow"></i>
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => this.props.history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 菜单项 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          square={false}
          renderItem={dataItem => (
            <Link to={dataItem.to}>
              <div className={styles.menuItem}>
                <i className={`iconfont ${dataItem.icon}`}></i>
                <span>{dataItem.name}</span>
              </div>
            </Link>
          )}
        />
        {/* 广告 */}
        <div className={styles.ad}>
          <img src={`${BASE_URL}/img/profile/join.png`} alt="" />
        </div>
      </>
    )
  }
}

export default Index
