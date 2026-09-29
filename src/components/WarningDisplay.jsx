import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WarningDisplay({ label, important = false }) {
    return (
        <section
            className={`
            flex flex-row
            w-fit
            px-4! py-1! gap-1 mt-3!
            items-center justify-center
            self-center
            border-2 rounded-full
            ${important ?
                    'bg-red-950/50 border-red-600 text-red-600' :
                    'bg-amber-950/50 border-amber-600 text-amber-600'
                }
            `}
        >
            <FontAwesomeIcon icon={important ? 'warning' : 'info-circle'} />
            <strong>{label}</strong>
        </section>
    )
}
export default WarningDisplay