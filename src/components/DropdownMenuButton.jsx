import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function DropdownMenuButton({ data, onSelected }) {
    return (
        <button
            className="
            transition cursor-pointer
            flex flex-row
            items-center
            p-1! gap-1
            hover:bg-white/20
            rounded-sm
            whitespace-nowrap
            "
            onClick={() => onSelected(data ?? data)}
        >
            <FontAwesomeIcon icon={data.icon} size="md" />
            <strong>
                {data.label}
            </strong>
        </button>
    )
}
export default DropdownMenuButton