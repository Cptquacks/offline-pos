import { faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ProviderBuyIndicator({ days, onRebuy }) {
    return (
        <div className="
        flex flex-row
        items-center
        px-4! py-0.5! gap-3
        bg-(--bg-alt)
        border border-(--border)
        rounded-full
        ">
            {days <= 0 &&
                <button className="
                transition cursor-pointer
                flex flex-row
                items-center
                px-3! py-1! gap-1
                bg-(--accent-alt) text-white!
                hover:bg-white! hover:text-(--bg-alt)!
                rounded-xs
                " onClick={onRebuy}>
                    <strong>
                        Recompra
                    </strong>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            }

            {days > 0 && <FontAwesomeIcon icon={faRotateLeft} />}
            {days > 0 &&
                <p>
                    Recompra: {days} dias
                </p>
            }
            {days === 0 &&
                <p>
                    Hoy
                </p>
            }
            {days < 0 &&
                <p>
                    Dias de retraso: {days}
                </p>
            }
        </div>
    )
}
export default ProviderBuyIndicator