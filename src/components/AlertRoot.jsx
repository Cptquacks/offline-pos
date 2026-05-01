import { useEffect } from "react"
import useAlertStore from "../stores/alertStore"

function AlertRoot() {
    const { alertTrail, removeAlert } = useAlertStore()

    useEffect(() => {
        setTimeout(() => {
            removeAlert()
            return
        }, 1500);
    }, [alertTrail, removeAlert])

    if (alertTrail.length === 0) return null
    return (
        <div className="
        fixed
        left-0 bottom-0
        flex flex-col
        h-fit
        z-50
        items-stretch
        p-4! gap-3
        bg-black/50
        min-w-1/5
        ">
            {alertTrail.map((alert, index) => <div key={index}>{alert}</div>)}
        </div>
    )
}

export default AlertRoot