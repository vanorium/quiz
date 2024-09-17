import Lobby from './components/Lobby/Lobby.jsx'
import Header from './components/Header/Header.jsx'
import Room from './components/RoomOption/RoomOption.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/room" element={<Room/>} />
          <Route path="*" element={<Lobby/>}/>
        </Routes>
      </Router>
    </>
  )
}