import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TagItem({ label, color, icon }) {
    const customStyle = color
        ? { backgroundColor: `lch(${color} / 0.3)`, }
        : {}
    return (
        <div className="
        flex flex-row
        items-center
        h-fit w-fit
        px-4! py-1! gap-1
        border-2 border-white/20
        rounded-full
        bg-(--accent-alt)/30
        text-white!
        "style={
                customStyle
            }>
            <FontAwesomeIcon icon={`${icon ?? 'times'}`} />
            <strong>
                {label ?? 'N/A'}
            </strong>
        </div>
    )
}

export default TagItem