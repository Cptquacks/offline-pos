import { useState } from "react"

function ColumnSelector({ label, columns, onSelected }) {
    const [currentColumn, setCurrentColumn] = useState(null)

    const handleSelection = (selection) => {
        onSelected(selection)
        setCurrentColumn(selection)
    }

    return (
        <div className="
        flex flex-col
        p-4! gap-px
        border border-(--border)
        bg-(--bg-alt)
        rounded-md
        ">
            <strong>
                {label}
            </strong>
            <select
                className="bg-(--bg-alt)"
                value={currentColumn}
                onChange={event => handleSelection(event.target.value)}
                name="column-selector">
                <option value="null">Sin asignar</option>
                {columns.map((column, index) =>
                    <option key={index} value={column}>
                        {column}
                    </option>
                )}
            </select>
        </div>
    )
}
export default ColumnSelector