import { faCalendar, faDollarSign, faMoneyBillTransfer, faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons"
import DefaultButton from "./DefaultButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function AutomaticEconomyForm({ currentTrace, closingDay, onClose }) {
    return (
        <form className="
        flex flex-col
        items-stretch
        p-4! gap-3
        bg-(--bg-soft)
        rounded-md
        border border-(--border)
        " onSubmit={onClose}>
            <div className="
                            flex flex-row
                            px-2! py-0.5! gap-2
                            bg-(--bg-alt)
                            border border-(--border)
                            rounded-sm
                            ">
                <strong className="
                                flex flex-row
                                items-center
                                gap-0.5
                                ">
                    <FontAwesomeIcon icon={faCalendar} />
                    Fecha:
                </strong>

                <p className="self-end">
                    {currentTrace.date ?? 'ERR'}
                </p>
            </div>

            <div className="
                            flex flex-col
                            bg-(--bg-alt)
                            p-2!
                            border border-(--border)
                            rounded-sm
                            ">
                <div className="
                                flex flex-row 
                                items-center 
                                gap-1
                                ">
                    <FontAwesomeIcon icon={faDollarSign} />
                    <p>Ventas:</p>
                    <strong>{currentTrace.sells}</strong>
                </div>

                <div className="
                                flex flex-row 
                                items-center
                                gap-1
                                ">
                    <FontAwesomeIcon icon={faMoneyBillTransfer} />
                    <p>Reembolsos:</p>
                    <strong>{currentTrace.refunds}</strong>
                </div>
            </div>

            <div className="
                            flex flex-col
                            bg-(--bg-alt)
                            p-2!
                            border border-(--border)
                            rounded-sm
                            ">
                <div className="
                                flex flex-row
                                items-center
                                gap-1
                                ">
                    <FontAwesomeIcon icon={faMoneyBillTrendUp} />
                    <strong>Ganancias</strong>
                </div>

                <div
                    className="
                    flex flex-row
                    gap-3
                    "
                >
                    {Object.keys(currentTrace.total ?? {}).map((entry, index) =>
                        <div
                            key={index}
                            className="
                            flex flex-row
                            items-center
                            gap-1
                            "
                        >
                            <p>{entry}:</p>
                            <strong>{currentTrace.total[entry] || 0}</strong>
                        </div>
                    )}

                </div>
            </div>

            <div className="last:self-center">
                <DefaultButton
                    label="Cerrar día"
                    icon="cash-register"
                    type="submit"
                    disabled={closingDay}
                    iconLeft
                />
            </div>
        </form>
    )
}
export default AutomaticEconomyForm