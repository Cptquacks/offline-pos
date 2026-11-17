import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function MissingData() {
    return (
        <div className="
        flex flex-row
        items-center
        h-fit w-fit
        px-2! pl-0.5! py-0.75! gap-1
        bg-amber-950/30
        border border-amber-600
        text-amber-600!
        rounded-full
        text-sm
        ">
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            <strong>
                Datos faltantes
            </strong>
        </div>
    )
}
export default MissingData