import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDialogStore from "../stores/dialogStore";
import ConfirmDialog from "./ConfirmDialog";

function DeleteButton({ onDelete, label }) {

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
            flex flex-row
            transition cursor-pointer
            items-center
            bg-red-500/60 text-white!
            w-fit h-fit
            p-1.25! px-1.75!
            border-2 border-white/15
            rounded-xs

            hover:bg-white
            hover:*:text-(--bg)
            "
            onClick={handleOnClick}
        >
            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
            {label && <strong>{label}</strong>}
        </div>
    )
}

export default DeleteButton