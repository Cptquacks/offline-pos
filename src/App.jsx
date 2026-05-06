import { useEffect } from 'react'
import AlertRoot from './components/AlertRoot'
import DialogRoot from './components/DialogRoot'
import SectionDisplay from './components/SectionDisplay'
import SideBar from './components/SideBar'
import useDialogStore from './stores/dialogStore'
import LicenseDialog from './components/LicenseDialog'

function App() {
    const { openDialog } = useDialogStore()

    useEffect(() => {
        openDialog(
            <LicenseDialog />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
