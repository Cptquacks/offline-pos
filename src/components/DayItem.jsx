import { faHandHoldingDollar, faMoneyBillWave, faStamp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeleteButton from "./DeleteButton"

function DayItem({ data, isOnPreview = false }) {
    return (
        <div className="
        bg-(--bg-soft)
        w-full min-w-1/2!
        rounded-lg
        ">
            <div className="
            flex flex-row 
            items-center
            p-2! gap-1.5
            bg-(--bg-alt) text-white!
            border-x border-t border-dashed border-white/50
            rounded-t-lg
            ">
                <FontAwesomeIcon icon={faStamp} />
                <strong>{data.date}</strong>
            </div>

            <div className="
            flex-1
            border-x border-(--border)
            flex flex-col
            p-2! gap-1
            ">
                <strong className="
                flex flex-row 
                items-center
                gap-1
                ">
                    <FontAwesomeIcon icon={faHandHoldingDollar} />
                    Ventas: {data.sells}
                </strong>
                <strong className="
                flex flex-row 
                items-center
                gap-1
                ">
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    Reembolsos: {data.refunds}
                </strong>

                <div className="
                flex-1 flex flex-col
                p-2! gap-1
                bg-(--bg-alt)
                border border-(--border)
                rounded-md
                ">
                    <strong className="col-span-2 justify-self-center">Ganancias</strong>
                    <div className="flex flex-col">
                        <p>
                            CUP: <strong>{data.total?.CUP ?? data.CUP}</strong>
                        </p>
                        <p>
                            USD: <strong>{data.total?.USD ?? data.USD}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="
            flex flex-row
            border-x border-b border-dashed border-white/50
            items-center justify-end
            rounded-b-lg
            bg-(--bg-alt)
            p-2!
            ">
                {!isOnPreview && <DeleteButton />}
            </div>
        </div>
    )
}
export default DayItem