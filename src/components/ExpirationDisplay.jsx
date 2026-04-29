import { useMemo } from "react"

function ExpirationDisplay({ days }) {
    const display = useMemo(() => {
        if (days >= 14) {
            return 3
        }

        else if (days >= 7) {
            return 2
        }

        else if (days > 0) {
            return 1
        }

        return 0
    }, [days])
    return (
        <>

            {display === 0 && <div className="
            px-4! py-0.5!
            rounded-full
            border border-red-600
            bg-red-950/50
            ">
                <strong className="
                text-red-600!
                ">
                    Expirado
                </strong>

            </div>}

            {display === 1 && <div className="
            px-4! py-0.5!
            rounded-full
            border border-red-600
            bg-red-950/50
            ">
                <strong className="
                text-red-600!
                ">
                    Expira en {days} días !
                </strong>

            </div>}

            {display === 2 && <div className="
            px-4! py-0.5!
            rounded-full
            border border-amber-600
            bg-amber-950/50
            ">
                <strong className="
                text-amber-600!
                ">
                    Expira en {(days / 7).toFixed(0)} semanas
                </strong>

            </div>}

            {display === 3 && <div className="
            px-4! py-0.5!
            rounded-full
            border border-green-600
            bg-green-950/50
            ">
                <strong className="
                text-green-600!
                ">
                    Expira en 1 mes
                </strong>

            </div>}
        </>
    )
}
export default ExpirationDisplay