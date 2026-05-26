import { useEffect } from "react"
import useRoleStore from "../stores/roleStore"
import useTagStore from "../stores/tagStore"
import TagItem from "../components/TagItem"
import TagList from "../components/TagList"
import usePreferenceStore from "../stores/preferenceStore"
import PreferenceSwitch from "../components/PreferenceSwitch"
import { randomLCH } from "../utils/tag-util"
import useCurrencyStore from "../stores/currencyStore"

function SettingsView() {

    const { preferenceData, loadData, setPreference } = usePreferenceStore()
    const { roleList, loadRoles, deleteRoles, addRole, modifyRole } = useRoleStore()
    const { tagList, loadTags, deleteTags, addTag, modifyTag } = useTagStore()
    const { currencyList, loadData: loadCurrencies, addCurrency, deleteCurrency } = useCurrencyStore()

    useEffect(() => {
        loadData()
        loadRoles()
        loadTags()
        loadCurrencies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <section className="
        grid grid-cols-1 grid-rows-1
        h-full
        p-4!
        ">

            <div className="
            flex-1
            flex flex-col
            w-full self-stretch
            bg-(--bg-soft)
            rounded-md
            p-4! gap-4
            overflow-y-auto
            ">
                <div className="
                grid grid-cols-2 grid-rows-3
                w-fit
                gap-3
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

                    <TagList
                        label="Monedas"
                        elements={currencyList}
                        icon="dollar-sign"
                        onAdd={data => addCurrency(data)}
                        onDelete={data => deleteCurrency(data)} />

                    <span className="mb-4! col-span-full opacity-0">
                        Si estas leyendo esto vamos a tener problemas tu y yo
                    </span>
                </div>

            </div>

        </section>
    )
}

export default SettingsView