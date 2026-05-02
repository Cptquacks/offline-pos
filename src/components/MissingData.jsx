import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function MissingData() {
    return (
        <div className="
        flex flex-row
        items-center
        h-fit w-fit
        px-4! py-0.5! gap-1
        bg-amber-950/30
        border border-amber-600
        text-amber-600!
        rounded-full
        ">
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            <strong>
                Datos faltantes
            </strong>
        </div>
    )
}
export default MissingData