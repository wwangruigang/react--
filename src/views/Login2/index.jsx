import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { Flex, WingBlank, Toast } from 'antd-mobile'
import { setToken } from '../../utils/token'

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  login = async e => {
    e.preventDefault()

    const result = await this.$axios.post('/user/login', this.state)

    console.log(result.data)
    const { status, description } = result.data

    if (status === 200) {
      // 登录成功
      const {
        body: { token }
      } = result.data

      // 保存token
      setToken(token)

      // 返回
      this.props.history.goBack()
    } else {
      // 登录失败
      Toast.info(description, 1.5)
    }
  }

  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WingBlank size="lg">
          <form onSubmit={this.login}>
            <div className={styles.formSubmit}>
              <input
                placeholder="请输入用户名"
                className={styles.input}
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.formSubmit}>
              <input
                placeholder="请输入密码"
                className={styles.input}
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.formSubmit}>
              <input className={styles.submit} type="submit" />
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>还没有账号，去注册~</Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
