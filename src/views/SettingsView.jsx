import { useEffect, useState } from "react"
import useRoleStore from "../stores/roleStore"
import useTagStore from "../stores/tagStore"
import TagItem from "../components/TagItem"
import TagList from "../components/TagList"
import usePreferenceStore from "../stores/preferenceStore"
import PreferenceSwitch from "../components/PreferenceSwitch"
import { randomLCH } from "../utils/tag-util"

function SettingsView() {

    const { preferenceData, loadData, setPreference } = usePreferenceStore()
    const { roleList, loadRoles, deleteRoles, addRole } = useRoleStore()
    const { tagList, loadTags, deleteTags, addTag } = useTagStore()

    const [selectedTags, setSelectedTags] = useState([])
    const [selectedCharges, setSelectedCharges] = useState([])

    useEffect(() => {
        loadRoles()
        loadTags()
        loadData()
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
                        onAdd={data => addTag({ name: data, color: randomLCH() })}
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
                                        checked={selectedTags.includes(index)}
                                        onChange={() => {
                                            if (selectedTags.includes(index)) {
                                                setSelectedTags(prev => [...prev.filter(entry => entry !== index)])
                                                return
                                            }
                                            setSelectedTags(prev => [...prev, index])
                                        }} />
                                </div>

                                <TagItem
                                    key={index}
                                    label={tag.name}
                                    color={tag.color}
                                    icon="tag" />
                            </div>
                        )}
                    </TagList>

                    <TagList
                        label="Cargos"
                        selected={selectedCharges}
                        onAdd={data => addRole({ name: data, color: randomLCH() })}
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
                                        checked={selectedCharges.includes(index)}
                                        onChange={() => {
                                            if (selectedCharges.includes(index)) {
                                                setSelectedCharges(prev => [...prev.filter(entry => entry !== index)])
                                                return
                                            }
                                            setSelectedCharges(prev => [...prev, index])
                                        }} />
                                </div>

                                <TagItem
                                    key={index}
                                    label={tag.name}
                                    color={tag.color}
                                    icon="user-tag" />
                            </div>
                        )}
                    </TagList>
                </div>

                <div className="
                flex flex-col
                gap-3
                ">
                    {preferenceData.map((fragment, index) =>
                        <PreferenceSwitch
                            key={index}
                            name={fragment.name}
                            value={fragment.value}
                            onChange={value => setPreference(index, value)} />
                    )}
                </div>
            </div>

        </section>
    )
}

export default SettingsView