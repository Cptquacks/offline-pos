import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DeleteButton({ onDelete }) {
    return (
        <div className="
        transition cursor-pointer
        bg-red-500/60 text-white!
        w-fit h-fit
        p-1!
        border-2 border-(--border)
        hover:shadow-(--shadow)
        rounded-lg
        " onClick={onDelete}>
            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div>
    )
}

export default DeleteButton