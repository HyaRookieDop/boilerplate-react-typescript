/*
 * @Author: hya ilovecoding@foxmail.com
 * @Date: 2022-07-22 15:29:20
 * @LastEditors: hya ilovecoding@foxmail.com
 * @LastEditTime: 2022-08-31 16:12:14
 * @FilePath: /rod-asset-front/src/index.tsx
 * @Description:
 *
 */
import './virtual:windi.css'
import './mock'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from '@/store'

import App from './App'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
