import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ListItemSM({ label, icon }) {
    return (
        <div className="
        flex flex-row
        items-center
        px-2! pr-3! py-px! gap-1
        text-white!
        bg-(--accent-alt)/50
        border-2 border-(--border)
        rounded-full
        ">
            <FontAwesomeIcon icon={`fa fa-${icon}`} />
            <p className="
            font-bold!
            text-white!
            ">
                {label}
            </p>
        </div>
    )
}
export default ListItemSM