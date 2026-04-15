import { faDizzy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EmptyList() {
    return (
        <div className="
        flex flex-row
        items-center justify-center self-center
        p-4!
        border-2 border-dashed border-(--border)
        bg-(--bg-alt)
        text-2xl font-bold">
            Esta lista está vacía
            <FontAwesomeIcon icon={faDizzy} size="md" />
        </div>
    )
}

export default EmptyList