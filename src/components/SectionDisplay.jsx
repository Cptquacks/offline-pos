import { Route, Routes } from "react-router-dom"
import NotFound from "./NotFound"
import ResumeView from "../views/ResumeView"
import InventoryView from "../views/InventoryView"
import EmployeView from "../views/EmployeView"
import KioskView from "../views/KioskView"
import SettingsView from "../views/SettingsView"

function SectionDisplay() {
    return (
        <main className="
        flex flex-col flex-1
        ">
            <Routes>
                <Route path="/resume" element={<ResumeView />} />
                <Route path="/inventory" element={<InventoryView />} />
                <Route path="/employees" element={<EmployeView />} />
                <Route path="/kiosk" element={<KioskView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    )
}
export default SectionDisplay