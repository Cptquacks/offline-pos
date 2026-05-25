import { useEffect, useMemo, useState } from "react"
import useTagStore from "../stores/tagStore"
import TagItem from "./TagItem"

function TagSelector({ onChange }) {
    const { tagList, loadTags } = useTagStore()

    const [selectedTag, setSelectedTag] = useState('N/A')

    const currentTag = useMemo(() => {
        let tag = { name: selectedTag, color: '0%,0,0' }
        const filteredTag = tagList.find(tag => tag.name === selectedTag) ?? {}

        return { ...tag, ...filteredTag }
    }, [tagList, selectedTag])

    const handleChange = (event) => {
        setSelectedTag(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        loadTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (tagList.length === 0) return

        onChange(tagList[0].name)
        setSelectedTag(tagList[0].name)
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

                <TagItem label={currentTag.name} color={currentTag.color} icon="tag" />
            </div>

            <select value={selectedTag} onChange={handleChange} className="
            border border-white/20
            bg-(--bg)
            px-2! py-0.5!
            rounded-sm
            ">
                {tagList.map((tag, index) => <option key={index} value={tag.name}>{tag.name}</option>
                )}
            </select>
        </div>
    )
}
export default TagSelector