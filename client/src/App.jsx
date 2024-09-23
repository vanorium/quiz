import Lobby from './components/Lobby/Lobby.jsx'
import Room from './components/Room/Room.jsx'
import Counting from './components/Counting/Counting.jsx'
import Game from './components/Game/Game.jsx'
import Break from './components/Break/Break.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Lobby/>}/>
          <Route path="/room" element={<Room/>} />
          <Route path="/counting" element={<Counting/>} />
          <Route path="/game" element={<Game/>} />
          <Route path="/break" element={<Break/>} />
        </Routes>
      </Router>
    </>
  )
}