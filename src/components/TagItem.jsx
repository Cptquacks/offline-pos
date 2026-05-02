import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TagItem({ label, icon }) {
    return (
        <div className="
        flex flex-row
        items-center
        h-fit w-fit
        px-4! py-1! gap-1
        border-2 border-(--accent)/30
        rounded-full
        bg-(--accent-alt)/30
        text-white!
        ">
            <FontAwesomeIcon icon={`${icon ?? 'times'}`} />
            <strong>
                {label}
            </strong>
        </div>
    )
}

export default TagItem