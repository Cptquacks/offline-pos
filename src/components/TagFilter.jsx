import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

function TagFilter({ filters = [], onSelect }) {

    const [selection, setSelection] = useState('Todos')

    const handleSelection = (event) => {
        onSelect(event.target.value)
        setSelection(event.target.value)
    }

    return (
        <div className="
        flex flex-row
        items-center justify-between
        pl-4.5! px-3! py-1! gap-px
        bg-(--bg-alt) text-white! 
        text-lg font-bold!
        border border-(--border)
        rounded-full">
            <FontAwesomeIcon icon={faFilter} />

            <select className="
            cursor-pointer
            bg-(--bg-alt)
            rounded-md
            " onChange={handleSelection} value={selection}>

                <option value="All">Todos</option>

                {filters.map((filter, index) =>
                    <option
                        key={index}
                        value={filter}
                    >
                        {filter}
                    </option>
                )}
            </select>
        </div>
    )
}
export default TagFilter