import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function SalaryDisplay({ value, currency }) {
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
                <FontAwesomeIcon icon={'dollar-sign'} />
                <div className="flex flex-row gap-1 items-center">
                    <strong>Salario: </strong>
                    <p>{value} {currency}</p>
                </div>
            </div>

        </section>
    )
}
export default SalaryDisplay