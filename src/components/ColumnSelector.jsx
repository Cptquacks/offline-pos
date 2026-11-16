import TagItem from "./TagItem"

function ColumnSelector({ label, columns, onSelected, optional = false, value = "null" }) {
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
                    {label} {!optional && <span className="text-red-400">*</span>}
                </strong>
            </div>

            <select
                className="bg-(--bg-alt)"
                value={value ?? "null"}
                onChange={event => onSelected(event.target.value)}
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