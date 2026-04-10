import './App.css'
import SectionDisplay from './components/SectionDisplay'
import SideBar from './components/SideBar'

function App() {

  return (
    <main className='flex flex-row w-full h-screen'>
      <SideBar />
      <SectionDisplay />
    </main>
  )
}

export default App
