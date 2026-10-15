import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DialogTopBar from "./DialogTopBar"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useMemo, useState } from "react"
import useDialogStore from "../stores/dialogStore"
import DefaultButton from "./DefaultButton"

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
                <div className="
                flex flex-row
                items-center
                p-4! py-2! gap-3
                bg-(--bg-soft)
                border border-white/15
                rounded-md
                ">
                    <strong className="text-xl">
                        Nueva nota:
                    </strong>

                    <input
                        className="
                        transition
                        flex-1
                        px-3! py-0.75!
                        bg-(--bg)
                        border border-white/15
                        rounded-sm
                        focus:border-(--accent-alt)
                        focus:bg-(--accent-alt)/45
                        focus:text-white!
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
                        transition
                        flex-1
                        w-full h-full
                        resize-none
                        p-4! py-3!
                        bg-(--bg-alt)
                        border border-white/15
                        rounded-md
                        focus:border-(--accent-alt)
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
                <DefaultButton
                    icon={'save'}
                    label={'Guardar'}
                    disabled={isNoteValid}
                    type="submit"
                />
            </div>
        </form>
    )
}
export default AddNoteDialog