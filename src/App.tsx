import { BrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'

import RenderRouter from './router'

function App() {
  return (
    <SWRConfig>
      <BrowserRouter>
        <RenderRouter></RenderRouter>
      </BrowserRouter>
    </SWRConfig>
  )
}

export default App
