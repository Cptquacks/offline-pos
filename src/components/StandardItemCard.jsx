import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import DateDisplay from "./DateDisplay";
import NoteItem from "./NoteItem";

function StandardItemCard({
    icon = 'times',
    codeBar,
    title, tagItem,
    stockDisplay, salaryDisplay,
    restockButton,
    expirationDisplay, notesDisplay,
    noteData = [], notesOpen = false,
    startDate, endDate,
    onEdit, onDelete, onNoteDelete,
    isOnPreview = false

}) {
    return (
        <section
            className="
            flex-1
            flex flex-col
            p-4! gap-3
            bg-(--bg-soft)
            border border-white/10
            rounded-sm
            "
        >
            <div
                className="
                flex flex-row
                min-h-16
                items-start
                gap-3
                "
            >
                <FontAwesomeIcon icon={icon} size="3x" />

                <div
                    className="
                    flex flex-row 
                    w-full
                    items-start justify-between 
                    "
                >
                    <div
                        className="
                        flex flex-col
                        gap-1
                        "
                    >
                        <strong className="text-xl">{title}</strong>
                        {codeBar && <strong className="text-sm opacity-50">Codigo: {codeBar}</strong>}
                    </div>
                    {tagItem}
                </div>
            </div>

            <hr className="border-white/10" />

            <footer
                className="
                flex flex-row
                justify-between *:items-center
                "
            >
                <div className="flex flex-row gap-3">
                    {stockDisplay ||
                        <div
                            className="
                            flex flex-row
                            items-center
                            gap-1 p-1.75! px-6!
                            bg-(--bg-alt)
                            border border-white/15
                            rounded-full
                            "
                        >
                            <FontAwesomeIcon icon={'hand-holding-dollar'} />
                            <strong>{salaryDisplay}</strong>
                        </div>
                    }
                    {(startDate || endDate) && <DateDisplay startsAt={startDate} endsAt={endDate} />}
                    {expirationDisplay || notesDisplay}
                </div>

                {!isOnPreview && <div className="flex flex-row gap-1 *:h-full">
                    {restockButton}
                    <EditButton onClick={onEdit} />
                    <DeleteButton onDelete={onDelete} />
                </div>}
            </footer>

            {((noteData ?? []).length > 0 && notesOpen) &&
                <div
                    className="
                    grid grid-cols-5
                    gap-3
                    "
                >
                    {noteData.map((note, index) =>
                        <NoteItem
                            key={index}
                            data={note}
                            onDelete={() => onNoteDelete(index)}
                        />
                    )}
                </div>
            }
        </section>
    )
}

export default StandardItemCard