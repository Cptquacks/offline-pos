import { faDizzy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function NotFound() {
    return (
        <section className="
        flex flex-col
        w-full h-full
        items-center justify-center
        ">
            <div className="
            flex flex-row
            items-center
            font-bold text-3xl
            gap-4 p-6!
            bg-(--bg-soft)
            border-2 border-dashed border-(--border)
            ">
                Ha ocurrido un error
                <FontAwesomeIcon icon={faDizzy} size="lg" />
            </div>
        </section>
    )
}

export default NotFound