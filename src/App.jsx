import { useEffect, useState } from 'react'
import AlertRoot from './components/AlertRoot'
import DialogRoot from './components/DialogRoot'
import SectionDisplay from './components/SectionDisplay'
import SideBar from './components/SideBar'
import useDialogStore from './stores/dialogStore'
import LicenseDialog from './components/LicenseDialog'
import usePreferenceStore from './stores/preferenceStore'
import LoadingWidget from './components/LoadingWidget'

function App() {
    const { loadData } = usePreferenceStore()
    const { openDialog } = useDialogStore()

    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        openDialog(
            <LicenseDialog />
        );

        (
            async () => {
                setLoading(true)
                await loadData()
            }
        )().then(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (isLoading) return (
        <main
            className='
            flex flex-row
            w-full h-screen
            items-center justify-center
            '
        >
            <LoadingWidget message='Espere un momento' />
        </main>
    )
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
