import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function TagFilter({ filters = [] }) {
    return (
        <div className="
        flex flex-row
        items-center
        px-3! py-1! gap-px
        bg-(--bg-alt) text-white! 
        text-lg font-bold!
        border border-(--border)
        rounded-full">
            <FontAwesomeIcon icon={faFilter} />
            <select>
                <option value="all">Todos</option>
                {filters.map((filter, index) =>
                    <option key={index} value={filter}>
                        {filter}
                    </option>
                )}
            </select>
        </div>
    )
}
export default TagFilter