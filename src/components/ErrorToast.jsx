import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ErrorToast({ label }) {

    return (
        <div className="
        flex flex-row
        w-full self-stretch
        bg-red-950
        border border-red-300/20
        text-red-200!
        overflow-hidden
        rounded-lg
        ">
            <FontAwesomeIcon
                className="
                p-1.5! py-2!
                bg-red-300/20
                "
                icon={faTimes}
                size="xl" />
            <strong className="
            px-1! py-0.5!
            text-md
            ">
                {label}
            </strong>
        </div>
    )
}

export default ErrorToast