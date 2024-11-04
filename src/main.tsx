// /src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'//追加
//import './index.css'削除
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'//追加


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*追加、修正ここから*/}
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
    {/*追加、修正ここまで*/}
  </StrictMode>,
)
