// /src/App.tsx

import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import UpdatePassword from "./components/UpdatePassword"//UpdatePassword追加
import SendReset from "./components/SendReset"//SendReset追加

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updatePassword" element={<UpdatePassword />}//UpdatePasswordのルート追加
        />
        <Route path="/sendReset" element={<SendReset />}//SendResetのルート追加
        />
      </Routes>
    </>

  )
}

export default App