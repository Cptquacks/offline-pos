import { useEffect, useState } from "react"
import ItemListSM from "../components/ItemListSM"
import ListItemSM from "../components/listItemSM"

function SettingsView() {

    const [preferences, setPreferences] = useState({
        "hasKiosk": true
    })
    const [tagsList, setTagsList] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    const [chargesList, setChargesList] = useState([])
    const [selectedCharges, setSelectedCharges] = useState([])


    const loadData = async () => {
        if (!window.electronAPI) return

        await window.electronAPI.readJSON('tags.json')
            .then(res => setTagsList(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('charges.json')
            .then(res => setChargesList(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('preferences.json')
            .then(res => setPreferences(prev => ({ ...prev, ...res })))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        loadData()
    }, [])

    /**
     * 
     * @param {Object} data 
     * @param {String} file 
     * @returns 
     */
    const writeDataARRAY = async (data, file) => {
        if (!window.electronAPI) return

        await window.electronAPI.modifyJSON(`${file}.json`, data)
            .then(() => loadData())
            .catch(err => console.error(err))
    }

    /**
     * 
     * @param {Object} data 
     * @param {String} file 
     * @returns 
     */
    const overwriteDataARRAY = async (data, file) => {
        if (!window.electronAPI) return

        await window.electronAPI.writeJSON(`${file}.json`, data)
            .then(() => loadData())
            .catch(err => console.error(err))
    }

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
                    <ItemListSM label="Categorías" selectedList={selectedTags}
                        onSubmit={data => writeDataARRAY(data, 'tags')}

                        onDelete={elements => {
                            const valoresAEliminar = elements.map(idx => tagsList[idx]);
                            const result = tagsList.filter(tag => !valoresAEliminar.includes(tag));

                            setTagsList(result);
                            setSelectedTags([]);
                            overwriteDataARRAY(result, 'tags');
                        }}>

                        {tagsList.map((item, index) =>
                            <div className={`
                            transition-normal cursor-pointer
                            hover:bg-white hover:**:text-(--bg-alt)!
                            ${selectedTags.includes(index) ?
                                    'bg-white **:text-(--bg-alt)!' :
                                    ''}
                            rounded-full
                            `}
                                key={index} onClick={
                                    () => {
                                        if (selectedTags.includes(index)) {
                                            setSelectedTags(prev => prev.filter(item => item !== index))
                                            return
                                        }
                                        setSelectedTags(prev => ([...prev, index]))
                                    }
                                }>
                                <ListItemSM label={item} icon="tag" />
                            </div>
                        )}

                    </ItemListSM>

                    <ItemListSM label="Cargos" selectedList={selectedCharges}
                        onSubmit={data => writeDataARRAY(data, 'charges')}

                        onDelete={elements => {
                            const valoresAEliminar = elements.map(idx => chargesList[idx]);
                            const result = chargesList.filter(tag => !valoresAEliminar.includes(tag));

                            setChargesList(result);
                            setSelectedCharges([]);
                            overwriteDataARRAY(result, 'charges');
                        }}>

                        {chargesList.map((item, index) =>
                            <div className={`
                            transition-normal cursor-pointer
                            hover:bg-white hover:**:text-(--bg-alt)!
                            ${selectedCharges.includes(index) ?
                                    'bg-white **:text-(--bg-alt)!' :
                                    ''}
                            rounded-full
                            `}
                                key={index} onClick={
                                    () => {
                                        if (selectedCharges.includes(index)) {
                                            setSelectedCharges(prev => prev.filter(item => item !== index))
                                            return
                                        }
                                        setSelectedCharges(prev => ([...prev, index]))
                                    }
                                }>
                                <ListItemSM label={item} icon="user-cog" />
                            </div>
                        )}

                    </ItemListSM>
                </div>
            </div>

        </section>
    )
}

export default SettingsView