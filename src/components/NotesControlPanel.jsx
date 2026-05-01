import { faCaretDown, faEllipsisH, faNoteSticky, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useDialogStore from "../stores/dialogStore"
import AddNoteDialog from "./AddNoteDialog"

function NotesControlPanel({ data, notesOpen, handleOpen, addNote }) {
    const { openDialog } = useDialogStore()

    const handleAdd = () => {
        openDialog(
            <AddNoteDialog onAdd={data => addNote(data)} />
        )
    }
    return (

        <div className="
        flex flex-row
        items-center justify-between
        px-4! pr-1! py-1! gap-3
        bg-(--bg-alt)
        border border-(--border)
        rounded-full
        ">
            <div className="
            flex flex-row
            items-center
            gap-0.5
            ">
                <FontAwesomeIcon icon={faNoteSticky} />
                <strong>
                    Notas: {data.notes?.length ?? 0}
                </strong>
            </div>

            <div className="
                flex flex-row
                items-center
                gap-1.25
                ">
                <button className="
                transition 
                not-disabled:cursor-pointer disabled:cursor-not-allowed
                flex flex-col
                items-center
                w-fit
                p-0.5! py-1!
                rounded-full
                bg-(--accent-alt) text-white!
                hover:not-disabled:bg-white hover:not-disabled:text-(--bg-alt)!
                disabled:opacity-50
                "
                    disabled={(data.notes ?? []).length === 0}
                    onClick={() => handleOpen(!notesOpen)}>
                    <FontAwesomeIcon icon={notesOpen ? faEllipsisH : faCaretDown} />
                </button>

                <button className="
                transition 
                not-disabled:cursor-pointer disabled:cursor-not-allowed
                flex flex-col
                items-center
                w-fit
                p-0.5! py-1!
                rounded-full
                bg-(--accent-alt) text-white!
                hover:not-disabled:bg-white hover:not-disabled:text-(--bg-alt)!
                " onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    )
}

export default NotesControlPanel