import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function LoadingWidget({ message = 'cargando sección' }) {

    return (
        <div
            className="
            flex flex-row
            items-center
            p-2! gap-1
            bg-(--bg-alt)
            border border-white/20
            rounded-sm
            "
        >
            {(message && message.length > 0) && <strong>{message}</strong>}
            <FontAwesomeIcon
                icon={faSpinner}
                size="md"
                spinPulse
            />
        </div>
    )
}
export default LoadingWidget