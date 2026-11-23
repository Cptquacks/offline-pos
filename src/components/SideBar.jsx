import { useEffect, useMemo, useState } from "react"
import SideBarButton from "./SideBarButton"
import usePreferenceStore from "../stores/preferenceStore"
//import useLicenseStore from "../stores/licenseStore"
import AccountDisplay from "./AccountDisplay"


function SideBar() {
    const { preferenceData, loadData } = usePreferenceStore()
    /* UNUSED CODE
    const { licenseList, loadLicenses } = useLicenseStore()
    const appVersion = import.meta.env.VITE_PROGRAM_VER
    const codeName = import.meta.env.VITE_PROGRAM_CODENAME
    */

    const showLabel = useMemo(() => {
        const result = preferenceData.find(pref => pref.key === 'sideBarExpanded')
        return result?.value ?? true
    }, [preferenceData])

    const hasKiosk = useMemo(() => {
        const result = preferenceData.find(pref => pref.key === 'hasKiosk')
        return result?.value ?? true
    }, [preferenceData])

    const [currentSelection, setSelection] = useState('/resume')
    const menuItems = [
        { label: 'Resumen', icon: 'tasks', route: '/resume' },
        { label: 'Proveedores', icon: 'sitemap', route: '/providers' },
        { label: 'Inventario', icon: 'dolly', route: '/inventory' },
        { label: 'Empleados', icon: 'users', route: '/employees' },
        hasKiosk ? { label: 'Kiosko', icon: 'store', route: '/kiosk' } : null,
        { label: 'Economía', icon: 'chart-line', route: '/business' },
        { label: 'Configuración', icon: 'sliders-h', route: '/settings' },
    ]

    useEffect(() => {
        (async () => {
            await loadData()
            //await loadLicenses()
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <aside className={`
        w-1/6
        flex flex-col 
        h-full 
        p-2! 
        bg-(--bg-soft)
        `}>
            <div className="
            w-full
            flex flex-col flex-1
            gap-2
            ">
                {menuItems.map((item, index) =>
                    item &&
                    <SideBarButton
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        route={item.route}
                        selected={item.route === currentSelection}
                        showLabel={showLabel}
                        onSelected={route => setSelection(route)}
                    />

                )}

            </div>
            <AccountDisplay />
        </aside>
    )
}
export default SideBar