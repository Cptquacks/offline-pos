import AlertRoot from './components/AlertRoot'
import DialogRoot from './components/DialogRoot'
import SectionDisplay from './components/SectionDisplay'
import SideBar from './components/SideBar'

function App() {

  return (
    <main className='flex flex-row w-full h-screen'>
      <SideBar />
      <SectionDisplay />
      <DialogRoot />
      <AlertRoot />
    </main>
  )
}

export default App
