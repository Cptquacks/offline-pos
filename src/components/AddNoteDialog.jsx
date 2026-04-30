import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DialogTopBar from "./DialogTopBar"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useMemo, useState } from "react"
import useDialogStore from "../stores/dialogStore"

function AddNoteDialog({ onAdd }) {
    const { closeDialog } = useDialogStore()
    const [noteData, setNoteData] = useState({
        title: '',
        value: ''
    })

    const isNoteValid = useMemo(() => {
        return noteData.title.trim().length === 0 || noteData.value.trim().length === 0
    }, [noteData])

    return (
        <form className="
        flex flex-col
        bg-(--bg)
        w-fit min-w-[50dvw]
        h-fit min-h-[50dvh]
        rounded-md
        border border-(--border)
        overflow-hidden
        " onSubmit={() => {
                onAdd(noteData)
                closeDialog()
            }}>
            <DialogTopBar label={'Notas'} />

            <div className="
            flex flex-col
            p-4! gap-3
            ">
                <strong className="text-2xl">
                    Nueva nota
                </strong>

                <div className="
                flex flex-row
                items-end
                w-fit
                p-4! py-2! gap-1
                bg-(--bg-soft)
                border border-(--border)
                rounded-md
                ">
                    <strong className="text-xl">
                        Titulo:
                    </strong>

                    <input
                        className="
                        px-2! py-0.5
                        bg-(--bg)
                        border border-(--border)
                        rounded-sm
                        "
                        type="text"
                        placeholder="Titulo de la nota..."
                        value={noteData.title}
                        onChange={event => setNoteData(prev => ({ ...prev, title: event.target.value }))} />
                </div>

                <div className="
                flex-1
                flex flex-col
                h-full
                ">
                    <strong className="text-lg">
                        Contenido:
                    </strong>
                    <textarea
                        className="
                        flex-1
                        w-full h-full
                        resize-none
                        p-4!
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        "
                        rows="16"
                        placeholder="Contenido de la nota..."
                        value={noteData.value}
                        onChange={event => setNoteData(prev => ({ ...prev, value: event.target.value }))}
                        required></textarea>
                </div>
            </div>

            <div className="
            flex flex-row
            items-center justify-end
            p-2! gap-2
            bg-(--border)
            ">
                <button className="
                transition 
                cursor-pointer disabled:cursor-not-allowed
                flex flex-row
                items-center
                px-3! py-1! gap-1
                bg-(--accent-alt) text-white!
                rounded-xs

                hover:not-disabled:bg-white hover:not-disabled:text-(--bg-alt)!

                disabled:opacity-50
                "
                    disabled={isNoteValid}>
                    <strong className="text-xl">
                        Guardar
                    </strong>
                    <FontAwesomeIcon icon={faSave} size="lg" />
                </button>
            </div>
        </form>
    )
}
export default AddNoteDialog