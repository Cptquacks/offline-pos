import { faNoteSticky, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function NoteItem({ data, onDelete }) {

    return (
        <div className="
        flex flex-col
        gap-0.5
        h-fit
        bg-(--bg-alt)
        rounded-md
        overflow-hidden
        border border-(--border)
        ">
            <div className="
            flex flex-row
            items-center justify-between
            text-white bg-(--border)
            p-2!
            ">
                <div className="
                flex flex-row items-center gap-1
                ">
                    <FontAwesomeIcon icon={faNoteSticky} size="xl" />
                    <strong className="text-2xl">
                        {data.title}
                    </strong>
                </div>

                <button className="
                transition-normal cursor-pointer
                bg-red-500/50
                text-white!
                p-1!
                border-2 border-(--border)
                rounded-lg
                hover:shadow-(--shadow)"
                    onClick={onDelete}                >
                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </button>
            </div>

            <p className="
            m-2!
            p-4! py-0! pb-2!
            bg-(--bg-soft)
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