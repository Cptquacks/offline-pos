import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StockDisplay({ stock }) {
    return (
        <section
            className="
            w-fit
            flex flex-row
            p-1! px-3! gap-6
            bg-(--bg-alt)
            border border-white/15
            rounded-full
            "
        >
            <div className="flex flex-row gap-2 items-center text-sm">
                <FontAwesomeIcon icon={"warehouse"} size="lg" />
                <span className="flex flex-row gap-1 items-center">
                    <strong>Stock:</strong>
                    <p>{stock}</p>
                </span>
            </div>
        </section>
    )
}
export default StockDisplay