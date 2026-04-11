
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './utils/Root'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'

function App() {
  
  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Root/>}/>
              <Route path='/admin-dashboard' element={
                  <ProtectedRoutes requireRole={["admin"]}>
                      <h1>Admin Dashboard</h1>
                  </ProtectedRoutes>}
              />
              <Route path='/boardMember-dashboard' element={<h1>BoardMember Dashboard</h1>}/>
              <Route path='/member-dashboard' element={<h1>Member Dashboard</h1>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/unauthorized' element={<h1>Unauthorized</h1>}/>

          </Routes>
      </Router>
    </>
  )
}

export default App
