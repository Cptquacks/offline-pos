import { faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeleteButton from "./DeleteButton"

function NoteItem({ data, onDelete }) {

    return (
        <div className="
        flex flex-col
        gap-0.5
        h-fit
        bg-(--bg-alt)
        rounded-md
        overflow-hidden
        border border-white/15
        ">
            <div className="
            flex flex-row
            items-center justify-between
            text-white bg-white/15
            p-2! py-1! pr-1! pb-1.5!
            ">
                <div className="
                flex flex-row items-center gap-1.5
                ">
                    <FontAwesomeIcon icon={faNoteSticky} size="xl" />
                    <strong className="text-2xl">
                        {data.title}
                    </strong>
                </div>

                <DeleteButton
                    onDelete={onDelete}
                />
            </div>

            <p className="
            min-h-42
            m-2!
            p-4! py-2! pb-2!
            bg-(--bg-soft)
            border border-white/5
            rounded-sm
            whitespace-pre-wrap
            wrap-break-word
            ">
                {data.value}
            </p>
        </div >
    )
}
export default NoteItem