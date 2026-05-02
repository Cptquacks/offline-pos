import { faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import useTagStore from "../stores/tagStore"

function TagSelector({ onChange }) {
    const { tagList, loadTags } = useTagStore()
    const [selectedTag, setSelectedTag] = useState(tagList[0])

    const handleChange = (event) => {
        setSelectedTag(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        loadTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        onChange(tagList[0])
        setSelectedTag(tagList[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList])

    return (
        <div className="
        flex flex-col
        bg-(--bg-soft)!
        px-4! py-3! gap-3
        border border-(--border)
        rounded-md
        ">
            <div className="
            flex flex-row
            justify-between items-center
            ">
                <p className="
                font-bold!
                ">
                    Categoría
                </p>

                <p className={`
                flex flex-row
                text-white! font-bold!
                items-center
                px-3! py-0.5! gap-1
                rounded-full
                bg-(--accent-alt)/60
                border-2 border-(--border)
                
                `}>
                    {selectedTag}
                    <FontAwesomeIcon icon={faTag} />
                </p>
            </div>

            <select value={selectedTag} onChange={handleChange} className="
            border border-white/20
            bg-(--bg)
            px-2! py-0.5!
            rounded-sm
            ">
                {tagList.map((tag, index) => <option key={index} value={tag}>{tag}</option>
                )}
            </select>
        </div>
    )
}
export default TagSelector