import { Outlet } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { SideBar } from './components/sidebar/SideBar'

function App() {
  return (
    <div className="w-full h-screen flex flex-col">

      <Header />

      <div className="flex flex-1 overflow-hidden">

        <SideBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default App