import { Route, Routes, useNavigate } from "react-router-dom"
import NotFound from "./NotFound"
import ResumeView from "../views/ResumeView"
import InventoryView from "../views/InventoryView"
import KioskView from "../views/KioskView"
import SettingsView from "../views/SettingsView"
import EconomyView from "../views/EconomyView"
import StaffView from "../views/StaffView"
import { useEffect } from "react"
import ProvidersView from "../views/ProvidersView"

function SectionDisplay() {
    const navigate = useNavigate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { navigate('/resume') }, [])

    return (
        <main className="
        flex flex-col flex-1
        ">
            <Routes>
                <Route path="/resume" element={<ResumeView />} />
                <Route path="/providers" element={<ProvidersView />} />
                <Route path="/inventory" element={<InventoryView />} />
                <Route path="/employees" element={<StaffView />} />
                <Route path="/kiosk" element={<KioskView />} />
                <Route path="/business" element={<EconomyView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    )
}
export default SectionDisplay