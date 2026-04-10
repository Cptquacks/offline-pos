import { useState } from "react"
import SideBarButton from "./SideBarButton"


function SideBar() {
    const [currentSelection, setSelection] = useState('/resume')
    const menuItems = [
        { label: 'Estadísticas', icon: 'tasks', route: '/resume' },
        { label: 'Inventario', icon: 'dolly', route: '/inventory' },
        { label: 'Empleados', icon: 'users', route: '/employees' },
        { label: 'Economía', icon: 'chart-line', route: '/business' },
    ]

    return (
        <aside className="
        flex flex-col flex-1/3
        h-full max-w-1/5
        p-2! 
        bg-(--bg-soft)
        ">
            <div className="
            flex flex-col flex-1
            gap-2
            ">

                {menuItems.map((item, index) =>
                    <SideBarButton key={index} label={item.label} icon={item.icon} route={item.route}
                        selected={item.route === currentSelection} onSelected={route => setSelection(route)} />
                )}

            </div>
            <div>
                <p className="
                font-bold
                text-sm underline underline-offset-2
                opacity-75 hover:opacity-100 cursor-pointer
                ">
                    &copy; Shard Development Team
                </p>
            </div>
        </aside>
    )
}
export default SideBar