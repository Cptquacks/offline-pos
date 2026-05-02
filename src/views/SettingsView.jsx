import { useEffect, useState } from "react"
import useRoleStore from "../stores/roleStore"
import useTagStore from "../stores/tagStore"
import TagItem from "../components/TagItem"
import TagList from "../components/TagList"

function SettingsView() {

    const { roleList, loadRoles, deleteRoles, addRole } = useRoleStore()
    const { tagList, loadTags, deleteTags, addTag } = useTagStore()

    const [selectedTags, setSelectedTags] = useState([])
    const [selectedCharges, setSelectedCharges] = useState([])

    useEffect(() => {
        loadRoles()
        loadTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid grid-cols-1 grid-rows-1
        h-full
        p-4!
        ">

            <div className="
            flex flex-col
            bg-(--bg-soft)
            rounded-md
            p-4! gap-4
            ">
                <div className="
                flex flex-row
                gap-4 h-1/2
                ">
                    <TagList
                        label="Categorías"
                        selected={selectedTags}
                        onAdd={data => addTag(data)}
                        onDelete={() => {
                            deleteTags(selectedTags)
                            setSelectedTags([])
                        }}>

                        {tagList.map((tag, index) =>
                            <div
                                key={index}
                                className="
                                flex flex-row 
                                items-center
                                gap-1
                                ">

                                <div
                                    className="
                                    flex flex-row 
                                    items-center justify-center
                                    p-2!
                                    bg-(--bg-alt)
                                    rounded-sm
                                    border border-(--border)
                                    ">

                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(prev => [...prev.filter(entry => entry !== tag)])
                                                return
                                            }
                                            setSelectedTags(prev => [...prev, tag])
                                        }} />
                                </div>

                                <TagItem
                                    key={index}
                                    label={tag}
                                    icon="tag" />
                            </div>
                        )}
                    </TagList>

                    <TagList
                        label="Cargos"
                        selected={selectedCharges}
                        onAdd={data => addRole(data)}
                        onDelete={() => {
                            deleteRoles(selectedCharges)
                            setSelectedCharges([])
                        }}
                    >

                        {roleList.map((tag, index) =>
                            <div
                                key={index}
                                className="
                                flex flex-row 
                                items-center
                                gap-1
                                ">

                                <div
                                    className="
                                    flex flex-row 
                                    items-center justify-center
                                    p-2!
                                    bg-(--bg-alt)
                                    rounded-sm
                                    border border-(--border)
                                    ">

                                    <input
                                        type="checkbox"
                                        checked={selectedCharges.includes(tag)}
                                        onChange={() => {
                                            if (selectedCharges.includes(tag)) {
                                                setSelectedCharges(prev => [...prev.filter(entry => entry !== tag)])
                                                return
                                            }
                                            setSelectedCharges(prev => [...prev, tag])
                                        }} />
                                </div>

                                <TagItem
                                    key={index}
                                    label={tag}
                                    icon="user-tag" />
                            </div>
                        )}
                    </TagList>
                </div>
            </div>

        </section>
    )
}

export default SettingsView