import { faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useDialogStore from "../stores/dialogStore"
import AddNoteDialog from "./AddNoteDialog"
import DefaultButtonSM from "./DefaultButtonSM"

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
        px-4! pr-1! py-0.75! gap-3
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
                <DefaultButtonSM
                    iconOne="caret-down"
                    iconTwo="ellipsis-h"

                    onChange={data => handleOpen(data)}
                    disabled={data.notes.length === 0}
                />

                <DefaultButtonSM
                    iconOne="plus"
                    onClick={handleAdd}
                    canChange={false}
                />
            </div>
        </div>
    )
}

export default NotesControlPanel