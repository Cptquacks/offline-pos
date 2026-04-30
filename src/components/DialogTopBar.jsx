import { useContext } from "react"
import { DialogContext } from "../context/DialogContex"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

function DialogTopBar({ label }) {
    const closeDialog = useContext(DialogContext)

    return (
        <div className="
        flex flex-row
        p-1! 
        items-c
        enter justify-between
        bg-(--border) text-white
        ">
            <strong className="
            text-2xl
            ">
                {label}
            </strong>

            <div>
                <button className="
                transition cursor-pointer
                p-1!
                bg-red-500/70
                border-(--border)
                rounded-sm
                hover:text-(--bg-alt) hover:bg-white!
                "
                    onClick={closeDialog}
                    type="button">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            </div>
        </div>
    )
}

export default DialogTopBar