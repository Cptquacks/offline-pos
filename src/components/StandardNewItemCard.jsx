import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function StandardNewItemCard({ label, onAdd }) {
    return (
        <section
            className="
            transition
            cursor-pointer
            flex flex-col
            items-center justify-center
            border rounded-sm
            border-white/15 
            border-dashed
            bg-(--bg-alt) 

            hover:bg-(--accent-alt)/50
            hover:border-(--accent-alt)
            hover:text-white
            "
            onClick={onAdd}
        >

            <FontAwesomeIcon
                className="my-6!
                p-4! px-2.75!
                border border-dashed
                rounded-full
                "
                icon={'plus'}
                size="3x"
            />

            <strong className="text-xl">
                {!/(?:N|n)uev(?:[Aa]|[Oo])/.test(label) && 'Nuevo '}
                {label}
            </strong>
        </section>
    )
}
export default StandardNewItemCard