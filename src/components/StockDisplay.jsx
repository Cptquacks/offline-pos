import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StockDisplay({ stock }) {
    return (
        <section
            className="
            min-w-fit
            flex flex-row
            p-2! px-6! gap-6
            bg-(--bg-alt)
            border border-white/15
            rounded-full
            "
        >
            <div className="flex flex-row gap-1 items-center">
                <FontAwesomeIcon icon={"warehouse"} size="lg" />
                <strong>Stock:</strong>
                <p>{stock}</p>
            </div>
        </section>
    )
}
export default StockDisplay