
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './utils/Root'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'

function App() {
  
  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Root/>}/>
              <Route 
                path='/admin-dashboard' 
                element={
                  <ProtectedRoutes requireRole={["admin"]}>
                      <Dashboard/>
                  </ProtectedRoutes>
                  }
              >
                <Route
                  index
                  element={<h1>Summary of dashboard</h1>}
                />
                <Route
                  path='profile'
                  element={
                    <h1>My Account</h1>
                  }
                />
                 <Route
                  path='members'
                  element={
                    <h1>Add Members</h1>
                  }
                />
                 <Route
                  path='ledger'
                  element={
                    <h1>Ledger</h1>
                  }
                />
                 <Route
                  path='fees'
                  element={
                    <h1>Subscription Fees</h1>
                  }
                />
                 <Route
                  path='projects'
                  element={
                    <h1>Projects</h1>
                  }
                />
                <Route
                  path='shares'
                  element={
                    <h1>Shares</h1>
                  }
                />
                <Route
                  path='endpoints'
                  element={
                    <h1>Endpoints</h1>
                  }
                />
                <Route
                  path='profiles'
                  element={
                    <h1>Profile Management</h1>
                  }
                />
                <Route
                  path='reports'
                  element={
                    <h1>Reports</h1>
                  }
                />
                 <Route
                  path='activities'
                  element={
                    <h1>Activities</h1>
                  }
                />
                 <Route
                  path='system'
                  element={
                    <h1>System Settings</h1>
                  }
                />
                
              </Route>
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
