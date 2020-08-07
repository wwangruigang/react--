import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/token'

function AuthRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        // 如果要做得严谨些，这个地方，我们应该拿着 token 再发请求给后台(/user/isLogin)，校验该用户的合法性
        // 如果我们该用户的token有效，并且没有过期，则返回 true 否则返回 false
        return isAuth() ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }}
    />
  )
}

export default AuthRoute
