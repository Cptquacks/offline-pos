import { faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DefaultButton from "./DefaultButton"

function ProviderBuyIndicator({ days, onRebuy }) {
    return (
        <div className="
        flex flex-row
        h-fit
        items-center
        px-6! py-0.5! gap-3
        bg-(--bg-alt)
        border border-(--border)
        rounded-full
        ">
            {days <= 0 &&
                <DefaultButton
                    label="Recompra"
                    icon="rotate-left"
                    onClick={onRebuy} />
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
                    Dias de retraso: {days * -1}
                </p>
            }
        </div>
    )
}
export default ProviderBuyIndicator