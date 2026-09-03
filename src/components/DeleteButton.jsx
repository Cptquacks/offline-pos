import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDialogStore from "../stores/dialogStore";
import ConfirmDialog from "./ConfirmDialog";

function DeleteButton({ onDelete }) {

    const { openDialog } = useDialogStore()

    const handleOnClick = () => {
        openDialog(
            <ConfirmDialog
                label="Seguro que deseas borrar este elemento?"
                callback={onDelete}
            />
        )
    }

    return (
        <div
            className="
            transition cursor-pointer
            bg-red-500/60 text-white!
            w-fit h-fit
            p-1!
            border-2 border-(--border)
            hover:shadow-(--shadow)
            rounded-lg
            "
            onClick={handleOnClick}
        >
            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div>
    )
}

export default DeleteButton