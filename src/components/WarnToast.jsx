import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function WarnToast({ label }) {

    return (
        <div className="
        flex flex-row
        w-full self-stretch
        gap-2

        bg-amber-950
        border border-amber-300/20
        text-amber-200!

        rounded-lg
        overflow-hidden
        ">
            <div className="
            flex flex-col
            w-fit
            items-center justify-center 
            bg-amber-300/20
            ">
                <FontAwesomeIcon
                    className="
                    flex-1
                    px-4!
                    "
                    icon={faWarning}
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

export default WarnToast