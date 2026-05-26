import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ErrorToast({ label }) {

    return (
        <div className="
        flex flex-row
        w-full self-stretch
        gap-2

        bg-red-950
        border border-red-300/20
        text-red-200!

        rounded-lg
        overflow-hidden
        ">
            <div className="
            flex flex-col
            w-fit
            items-center justify-center 
            bg-red-300/20
            ">
                <FontAwesomeIcon
                    className="
                    flex-1
                    px-4!
                    "
                    icon={faTimes}
                    size="md" />
            </div>

            <div className="flex-1">
                <strong className="text-md">
                    {label}
                </strong>
            </div>
        </div>
    )
}

export default ErrorToast