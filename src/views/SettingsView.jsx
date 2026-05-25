import { useEffect } from "react"
import useRoleStore from "../stores/roleStore"
import useTagStore from "../stores/tagStore"
import TagItem from "../components/TagItem"
import TagList from "../components/TagList"
import usePreferenceStore from "../stores/preferenceStore"
import PreferenceSwitch from "../components/PreferenceSwitch"
import { randomLCH } from "../utils/tag-util"

function SettingsView() {

    const { preferenceData, loadData, setPreference } = usePreferenceStore()
    const { roleList, loadRoles, deleteRoles, addRole, modifyRole } = useRoleStore()
    const { tagList, loadTags, deleteTags, addTag, modifyTag } = useTagStore()

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
                        elements={tagList}
                        icon={'tag'}

                        onAdd={data => {
                            addTag({ name: data, color: randomLCH() })
                            loadTags()
                        }}
                        onDelete={(data) => {
                            deleteTags(data)
                        }}
                        onModified={(data, index) => {
                            modifyTag(data, index)
                            loadTags()
                        }}
                    />

                    <TagList
                        label="Cargos"
                        elements={roleList}
                        icon={'user-tag'}

                        onAdd={data => {
                            addRole({ name: data, color: randomLCH() })
                            loadRoles()
                        }}
                        onDelete={(data) => {
                            deleteRoles(data)
                        }}
                        onModified={(data, index) => {
                            modifyRole(data, index)
                            loadRoles()
                        }} />

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