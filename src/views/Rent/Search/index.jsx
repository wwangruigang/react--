import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'
import styles from './index.module.scss'
import { getCurrentCity } from '../../../utils/city'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

class RentSearch extends Component {
  state = {
    searchText: '',
    tipsList: []
  }

  search = _.debounce(async val => {
    console.log('---debounce---')
    const { value } = await getCurrentCity()

    const result = await this.$axios.get('/area/community', {
      params: {
        id: value,
        name: val
      }
    })

    this.setState({
      tipsList: result.data.body
    })
  }, 500)

  changeSearchText = val => {
    this.setState(
      {
        searchText: val
      },
      () => {
        if (val.trim().length === 0) {
          return
        }

        // 执行搜索
        this.search(val)
      }
    )
  }

  getCommunity = ({ community, communityName }) => {
    // console.log(community, communityName)

    // history.push   ['/rent/add','/rent/search','/rent/add']

    // replace ['/rent/add']

    // this.props.history.replace(`/rent/add?community=${community}&communityName=${communityName}`)

    // 保存到本地
    localStorage.setItem('hkzf_community',JSON.stringify({community,communityName}))

    // 返回
    setTimeout(() => {
      this.props.history.goBack()
    }, 0);
  }

  /**
   * 渲染建议
   */
  renderTips = () => {
    const { tipsList } = this.state
    return (
      <ul className={styles.tips}>
        {tipsList.map(item => {
          return (
            <li
              onClick={() => this.getCommunity(item)}
              className={styles.tip}
              key={item.community}
            >
              {item.communityName}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        <SearchBar
          value={this.state.searchText}
          onChange={this.changeSearchText}
          onCancel={() => {
            this.setState({ searchText: '' }, () => {
              this.props.history.goBack()
            })
          }}
          placeholder="请输入小区或地址"
        />
        {this.state.tipsList.length > 0 && this.renderTips()}
      </div>
    )
  }
}

export default withRouter(RentSearch)
