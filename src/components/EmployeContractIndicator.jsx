import { faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo } from "react"

function EmployeContractIndicator({ days, onRenew }) {
    const status = useMemo(() => {
        if (days > 15) return 3
        else if (days > 7) return 2
        else if (days > 3) return 1
        return 0
    }, [days])
    return (
        <>
            {status === 3 &&
                <div className="
                flex flex-row
                items-center
                px-4! py-0.5!
                border border-green-600
                bg-green-950/30
                text-green-600
                rounded-full
                ">
                    <strong>
                        Fin de contrato en {days} días
                    </strong>
                </div>
            }
            {status === 2 &&
                <div className="
                flex flex-row
                items-center
                px-4! py-0.5!
                border border-amber-600
                bg-amber-950/30
                text-amber-600
                rounded-full
                ">
                    <strong>
                        Fin de contrato en {days} días
                    </strong>
                </div>
            }
            {status === 1 &&
                <div className="
                flex flex-row
                items-center
                px-4! py-0.5!
                border border-red-600
                bg-red-950/30
                text-red-600
                rounded-full
                ">
                    <strong>
                        Fin de contrato en {days} días
                    </strong>
                </div>
            }
            {status === 0 &&
                <div className="
                flex flex-row
                items-center
                px-4! py-0.5! gap-3
                border border-red-600
                bg-red-950/30
                text-red-600
                rounded-full
                ">
                    <button className="
                    transition cursor-pointer
                    flex flex-row
                    items-center
                    px-3! py-1! gap-1
                    text-white! bg-(--accent-alt)
                    hover:text-(--bg-alt)! hover:bg-white
                    rounded-xs
                    " onClick={onRenew}>
                        <FontAwesomeIcon icon={faRotateLeft} />
                        <strong>
                            Renovar
                        </strong>
                    </button>

                    <strong>
                        Expirado!
                    </strong>
                </div>
            }
        </>
    )
}

export default EmployeContractIndicator