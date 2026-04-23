import { faUserCog, faUser, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function EmployeItem({ data, onDelete }) {

    const handleDeletion = () => {
        onDelete(data.index)
    }
    return (
        <div className="
        flex flex-row
        items-start
        bg-(--bg-soft)
        p-2! gap-2
        border border-(--border)
        rounded-md
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


                    <div className="
                    flex flex-row
                    items-left
                    w-fit h-fit
                    p-2! gap-6
                    bg-(--bg-alt)
                    text-sm
                    rounded-sm
                    border border-(--border)
                    ">
                        <p>
                            Inicio de contrato:
                            <span className="font-bold">
                                {data.startDate ?? 'ERR'}
                            </span>
                        </p>

                        <p>
                            Fin de contrato:
                            <span className="font-bold">
                                {data.endDate ?? 'N/A'}
                            </span>
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
                bg-(--accent-alt)/50 
                text-white! font-bold!
                border-2 border-(--border)
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
    )
}
export default EmployeItem