import { useEffect, useMemo, useState } from "react"
import SideBarButton from "./SideBarButton"
import usePreferenceStore from "../stores/preferenceStore"


function SideBar() {
    const { preferenceData, loadData } = usePreferenceStore()
    const appVersion = import.meta.env.VITE_PROGRAM_VERSION
    const codeName = import.meta.env.VITE_PROGRAM_CODE

    const showLabel = useMemo(() => {
        const result = preferenceData.find(pref => pref.key === 'sideBarExpanded')
        return result?.value ?? true
    }, [preferenceData])

    const [currentSelection, setSelection] = useState('/resume')
    const menuItems = [
        { label: 'Resumen', icon: 'tasks', route: '/resume' },
        { label: 'Proveedores', icon: 'sitemap', route: '/providers' },
        { label: 'Inventario', icon: 'dolly', route: '/inventory' },
        { label: 'Empleados', icon: 'users', route: '/employees' },
        { label: 'Kiosko', icon: 'store', route: '/kiosk' },
        { label: 'Economía', icon: 'chart-line', route: '/business' },
        { label: 'Configuración', icon: 'sliders-h', route: '/settings' },
    ]

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <aside className={`
        ${showLabel ? 'flex-1/3' : 'w-fit'}
        flex flex-col 
        h-full max-w-1/5
        p-2! 
        bg-(--bg-soft)
        `}>
            <div className="
            flex flex-col flex-1
            gap-2
            ">

                {menuItems.map((item, index) =>
                    <SideBarButton
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        route={item.route}
                        selected={item.route === currentSelection}
                        showLabel={showLabel}
                        onSelected={route => setSelection(route)} />
                )}

            </div>
            {showLabel &&
                <div className="
                flex flex-col
                ">
                    <p className="
                    font-bold!
                    text-sm
                    ">
                        Versión: {appVersion} {codeName}
                    </p>

                    <p className="
                    font-bold
                    text-sm underline underline-offset-2
                    opacity-75 hover:opacity-100 cursor-pointer
                    ">
                        &copy; Shard Development Team
                    </p>
                </div>
            }
        </aside>
    )
}
export default SideBar