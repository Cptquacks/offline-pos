import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function WarnToast({ label }) {
    return (
        <div className="
        flex flex-row
        w-full self-stretch
        bg-amber-950
        border border-amber-300/20
        text-amber-200!
        overflow-hidden
        rounded-lg
        ">
            <FontAwesomeIcon
                className="
                p-1.5! py-2!
                bg-amber-300/20
                "
                icon={faWarning}
                size="xl" />
            <strong className="
            px-1! py-0.5!
            text-2xl
            ">
                {label}
            </strong>
        </div>
    )
}

export default WarnToast