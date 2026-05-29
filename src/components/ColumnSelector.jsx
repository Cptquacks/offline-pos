import { useEffect, useRef, useState } from "react"
import TagItem from "./TagItem"
import { stringSimilarity } from "../utils/string-util"

function ColumnSelector({ label, columns, onSelected, optional = false }) {
    const [currentColumn, setCurrentColumn] = useState("null")
    const onSelectedRef = useRef(onSelected);
    useEffect(() => {
        onSelectedRef.current = onSelected
    }, [onSelected])

    const handleSelection = (selection) => {
        onSelected(selection)
        setCurrentColumn(selection)
    }

    useEffect(() => {
        if (columns.length === 0) return
        let filteredColumns = columns.filter(entry => stringSimilarity(entry, label) >= 0.75)
        filteredColumns = filteredColumns.sort((a, b) => stringSimilarity(a, label) - stringSimilarity(b, label))

        setCurrentColumn(filteredColumns[0])
        onSelectedRef.current(filteredColumns[0])

    }, [columns, label])

    return (
        <div className="
        flex flex-col
        p-4! gap-3
        justify-between
        border border-(--border)
        bg-(--bg-alt)
        rounded-md
        ">
            <div className="
            flex flex-row
            justify-between items-start
            gap-3
            ">
                <strong>
                    {label}
                </strong>

                {optional &&
                    <TagItem label={'Opcional'} icon={'user-cog'} />
                }
            </div>

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