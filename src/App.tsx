import './App.css'

import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Add from './pages/Add'
import Edit from './pages/Edit'

function App() {
  return (
    <div className="bg-[#F2F3F7] min-h-screen py-8 px-5">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/add' element={<Add />} />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </div>
  )
}

export default App
