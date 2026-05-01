import { faUserCog, faUser, faTrashAlt, faCalendar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import NotesControlPanel from "./NotesControlPanel"
import { useMemo, useState } from "react"
import useStaffStore from "../stores/staffStore"
import EmployeContractIndicator from "./EmployeContractIndicator"
import NoteItem from "./NoteItem"
import { addDays, daysBetween, daysFromToday } from "../utils/date-util"

function EmployeItem({ data }) {

    const { modifyStaff, deleteStaff } = useStaffStore()
    const [notesOpen, setNotesOpen] = useState(false)

    const daysUntilEOC = useMemo(() => {
        if (!data.endDate) return null
        const result = daysFromToday(data.endDate)
        return result

    }, [data.endDate])

    const handleDeletion = () => {
        deleteStaff(data.index)
    }

    const handleRenew = () => {
        const days = daysBetween(data.startDate, data.endDate)
        const today = new Date().toLocaleDateString('sv-SE')
        let result = {
            ...data,
            startDate: today,
            endDate: addDays(today, days)
        }

        console.log(result)

        modifyStaff(result, data.index)
    }

    const handleNoteAddition = (note) => {
        let result = { ...data, notes: [...data.notes, { ...note }] }
        modifyStaff(result, data.index)
    }

    const handleNoteDeletion = (target) => {
        let result = { ...data, notes: [...data.notes.filter((_, index) => index !== target)] }
        modifyStaff(result, data.index)
    }

    return (
        <div className="
        flex flex-col
        bg-(--bg-soft)
        p-2! gap-3
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            w-full self-stretch
            items-start
            gap-1
            ">
                <FontAwesomeIcon className="
                mt-2!
                " icon={faUser} size="3x" />

                <div className="
                flex-1
                ">
                    <div className="
                    flex flex-col gap-3
                    ">
                        <div className="
                        flex flex-col
                        gap-2
                        ">
                            <div>
                                <p className="
                                text-2xl font-bold!
                                ">
                                    {data.name}
                                </p>

                                <p className="opacity-50 text-sm font-bold!">
                                    CI: {data.ID}
                                </p>
                            </div>

                            <p className="font-bold! text-sm">
                                Salarío: {data.salary}
                            </p>
                        </div>
                    </div>

                </div>

                <div className="
                flex flex-col 
                self-stretch justify-between items-end
                ">
                    <p className="
                    flex flex-row
                    items-center
                    px-2! py-0.5! gap-1
                    text-white! font-bold!
                    bg-(--accent-alt)/40
                    border-2 border-(--accent)/30
                    rounded-full
                    ">
                        <FontAwesomeIcon icon={faUserCog} />
                        {data.charge ?? 'N/A'}
                    </p>

                    <button className="
                    transition-normal cursor-pointer
                    bg-red-500/50
                    text-white/90
                    p-1!
                    rounded-lg
                    border-2 border-(--border)
                    hover:shadow-(--shadow)
                    " onClick={handleDeletion}>
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                    </button>
                </div>
            </div>

            <hr className="border-(--border)" />

            <div className="
            flex flex-col
            gap-3
            ">
                <div className="
                flex flex-row
                items-center justify-between
                ">
                    <NotesControlPanel
                        data={data}
                        notesOpen={notesOpen}
                        handleOpen={value => setNotesOpen(value)}
                        addNote={note => handleNoteAddition(note)}
                    />

                    {daysUntilEOC !== null &&
                        <EmployeContractIndicator
                            days={daysUntilEOC}
                            onRenew={handleRenew} />}

                    {daysUntilEOC === null &&
                        <div className="
                        flex flex-row
                        items-center
                        px-4! py-1! gap-1
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-full
                        ">
                            <FontAwesomeIcon icon={faCalendar} />
                            <strong>
                                Contratado desde {data.startDate}
                            </strong>
                        </div>
                    }
                </div>

                {notesOpen &&
                    <div className="
                    grid grid-cols-3 gap-3
                    ">
                        {data.notes.map((note, index) =>
                            <NoteItem
                                data={note}
                                onDelete={() => handleNoteDeletion(index)} />
                        )}
                    </div>
                }
            </div>
        </div>
    )
}
export default EmployeItem