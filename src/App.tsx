import './App.scss'

import { BrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import zhCN from 'antd/es/locale/zh_CN'
import RenderRouter from './router'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <SWRConfig>
        <BrowserRouter>
          <RenderRouter></RenderRouter>
        </BrowserRouter>
      </SWRConfig>
    </ConfigProvider>
  )
}

export default App
