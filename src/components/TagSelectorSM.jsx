import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

function TagSelectorSM({ icon = 'times', tags, currentTag, onSelected }) {

    const [selection, setSelection] = useState(currentTag)

    const handleSelection = (value) => {
        onSelected(value)
        setSelection(value)
    }

    return (
        <div className="
        flex flex-row
        items-center
        px-4! py-0.75! gap-1
        bg-(--bg-alt) text-white
        text-lg
        *:bg-(--bg-alt)

        rounded-full
        border border-white/20
        ">
            <FontAwesomeIcon icon={`${icon}`} />
            <select value={selection} onChange={event => handleSelection(event.target.value)}>
                {tags.map((tag, index) =>
                    <option key={index} value={tag}>{tag}</option>
                )}
            </select>
        </div>
    )
}
export default TagSelectorSM