import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StockDisplay({ total, amount }) {
    return (
        <section
            className="
            min-w-85
            flex flex-row
            p-2! px-6! gap-6
            bg-(--bg-alt)
            border border-white/15
            rounded-full
            "
        >
            <div className="flex flex-row gap-1 items-center">
                <FontAwesomeIcon icon={"clipboard-check"} size="lg" />
                <strong>Total:</strong>
                <p>{total}</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
                <FontAwesomeIcon icon={"warehouse"} size="lg" />
                <strong>Disponible:</strong>
                <p>{amount}</p>
            </div>
        </section>
    )
}
export default StockDisplay