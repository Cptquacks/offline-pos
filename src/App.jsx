import './App.css'
import DialogRoot from './components/DialogRoot'
import SectionDisplay from './components/SectionDisplay'
import SideBar from './components/SideBar'

function App() {

  return (
    <main className='flex flex-row w-full h-screen'>
      <SideBar />
      <SectionDisplay />
      <DialogRoot />
    </main>
  )
}

export default App
