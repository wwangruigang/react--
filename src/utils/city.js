import { axios } from './axios'

const KEY = 'hkzf_city_key'

/**
 * 获取本地存储的定位城市对象
 */
const getCity = () => {
  return window.localStorage.getItem(KEY)
}

/**
 * 保存定位城市对象到本地
 *
 * @param {*} city {label:'深圳',value:'AREA|a6649a11-be98-b150'}
 */
export const setCity = city => {
  window.localStorage.setItem(KEY, JSON.stringify(city))
}

const BMap = window.BMap

/**
 * 获取当前的城市
 */
export function getCurrentCity() {
  // 必须要返回一个Promise
  /** 
    if (本地没有) {
        return new Promise((resolve,reject) => {
            通过百度地图定位，获取到当前的城市名称【异步】

            把城市名称当成参数，然后通过调用后台接口 /area/info 获取城市对象的信息【异步】

            resolve(城市对象)

            保存到本地
        })
    } else {
        Promise.resolve(城市对象)
    }
    */

  // 从本地获取城市
  const city = getCity()

  if (!city) {
    // 本地没有城市数据
    return new Promise((resolve, reject) => {
      //1、通过百度地图定位，获取当前的城市名称
      var myCity = new BMap.LocalCity()
      myCity.get(async result => {
        //2、根据定位到的城市名称，调用后台的接口，获取城市信息（{label、value}）
        const res = await axios.get(`/area/info?name=${result.name}`)

        //3、resolve 出去
        resolve(res.data.body)

        //4、保存到本地
        setCity(res.data.body)
      })
    })
  } else {
    // 本地有
    // Promise.resolve 能快速的生成一个promise对象，并且把结果通过 resolve 传递出去
    // 这种适合确定一定会成功返回的情况
    return Promise.resolve(JSON.parse(city))
  }
}
