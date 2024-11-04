// /src/App.tsx

import { Route, Routes } from "react-router-dom"//React Routerインポート追加
import Home from "./components/Home"//Homeコンポーネント追加
import Login from "./components/Login"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}//Homeコンポーネントのルーティング設定
        />
        <Route path="/login" element={<Login />}//Loginコンポーネントのルーティング設定
        />
      </Routes>
    </>

  )
}

export default App