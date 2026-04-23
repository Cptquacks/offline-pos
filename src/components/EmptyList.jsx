import { faDizzy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function EmptyList() {
    return (
        <div className="
        flex flex-row
        items-center justify-self-center
        p-4! gap-1
        bg-(--bg)
        border-2 border-dashed border-white/40
        **:text-white/50!
        ">
            <p className="font-bold!">
                Esta lista esta vacía
            </p>
            <FontAwesomeIcon icon={faDizzy} size="lg" />
        </div>
    )
}
export default EmptyList