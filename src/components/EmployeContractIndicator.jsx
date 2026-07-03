import { useMemo } from "react"
import DefaultButton from "./DefaultButton"

function EmployeContractIndicator({ days, onRenew, showButton = true, isLoading = false }) {
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
                    {showButton &&
                        <DefaultButton
                            label="Renovar"
                            icon="rotate-left"
                            onClick={() => onRenew()}
                            loading={isLoading}
                        />
                    }

                    <strong>
                        Expirado!
                    </strong>
                </div>
            }
        </>
    )
}

export default EmployeContractIndicator