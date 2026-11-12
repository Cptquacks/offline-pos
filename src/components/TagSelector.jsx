import { useEffect, useMemo, useState } from "react"
import useTagStore from "../stores/tagStore"
import TagItem from "./TagItem"
import useRoleStore from "../stores/roleStore"

function TagSelector({ onChange, useRoles = false, selectedValue }) {
    const { tagList, loadTags } = useTagStore()
    const { roleList, loadRoles } = useRoleStore()

    const [selected, setSelected] = useState(selectedValue ?? 'N/A')

    const current = useMemo(() => {
        let current = { name: selected, color: '0%,0,0' }
        let filteredTag = {}

        if (!useRoles) {
            filteredTag = tagList.find(tag => tag.name === selected) ?? {}
        }

        else if (useRoles) {
            filteredTag = roleList.find(role => role.name === selected) ?? {}
        }

        return { ...current, ...filteredTag }
    }, [tagList, roleList, selected, useRoles])

    const handleChange = (event) => {
        setSelected(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        loadTags()
        loadRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (tagList.length === 0) return

        const value = selectedValue !== undefined
            ? selectedValue ?? 'N/A'
            : (useRoles ? roleList[0] : tagList[0])?.name ?? 'N/A'
        onChange(value)
        setSelected(value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagList, roleList, selectedValue])

    return (
        <div
            className="
            flex flex-col
            bg-(--bg-soft)!
            px-4! py-3! gap-3
            border border-(--border)
            rounded-md
            "
        >
            <div
                className="
                flex-1
                flex flex-row
                w-full
                justify-between items-center
                "
            >
                <strong>
                    Categoría
                </strong>

                <TagItem label={current.name} color={current.name !== 'N/A' ? current.color : null} icon="tag" />
            </div>

            <select
                value={selected}
                onChange={handleChange}
                className="
                px-2! py-1!
                bg-(--bg)
                border border-white/20
                rounded-sm
                "
            >
                <option value="N/A">Ninguno</option>
                {selectedValue && selectedValue !== 'N/A' &&
                    !(useRoles ? roleList : tagList).some(item => item.name === selectedValue) &&
                    <option value={selectedValue}>{selectedValue}</option>
                }
                {(useRoles ? roleList : tagList).map((tag, index) => <option key={index} value={tag.name}>{tag.name}</option>
                )}
            </select>
        </div>
    )
}
export default TagSelector