import { faTag } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

function TagSelector({ onChange }) {
    const [tags, setTags] = useState([])

    const [selectedTag, setSelectedTag] = useState(tags[0])

    const handleChange = (event) => {
        setSelectedTag(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('tags.json')
                .then(res => setTags(res))
                .catch(err => console.error(err))
        }

        awaitAPI()
    }, [])

    useEffect(() => {
        onChange(tags[0])
        setSelectedTag(tags[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags])

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
                {tags.map((tag, index) => <option key={index} value={tag}>{tag}</option>
                )}
            </select>
        </div>
    )
}
export default TagSelector