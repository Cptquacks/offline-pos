import { useEffect, useMemo, useState } from "react"
import EmployeForm from "../components/EmployeForm"
import SearchBar from "../components/SearchBar"
import ImportPanel from "../components/ImportPanel"
import ItemsList from "../components/ItemsList"
import useStaffStore from "../stores/staffStore"
import EmployeItem from "../components/EmployeItem"
import { stringSimilarity } from "../utils/string-util"
import useRoleStore from "../stores/roleStore"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import { randomLCH } from "../utils/tag-util"
import TotalWasteDisplay from "../components/TotalWasteDisplay"
import useDialogStore from "../stores/dialogStore"
import LoadingDialog from "../components/LoadingDialog"
import DropdownMenu from "../components/DropdownMenu"

function StaffView() {
    const { staffData, loadData, addStaff, overwriteFile } = useStaffStore()
    const { roleList, addRole, loadRoles } = useRoleStore()
    const { openDialog, closeDialog } = useDialogStore()

    const roles = useMemo(() => {
        let result = [{ label: 'Todos', icon: 'filter', value: 'All' }]
        const mappedRoles = roleList.map(role => ({ label: role.name, icon: 'user-tag' }))
        result = result.concat(mappedRoles)
        return result
    }, [roleList])

    const [filter, setFilter] = useState('All')
    const [query, setQuery] = useState('')

    const filteredList = useMemo(() => {
        let result = staffData.map(entry => entry)

        if (filter !== 'All') {
            result = result.filter(product => product.charge === filter)
        }

        if (query.trim().length > 0) {
            result = result.filter(product => stringSimilarity(product.name, query) >= 0.3)
            result = result.map(product => ({ ...product, similarity: stringSimilarity(product.name, query) }))
            result = result.sort((a, b) => b.similarity - a.similarity)

        }

        return result
    }, [query, filter, staffData])

    const exportedData = useMemo(() => {
        let result = filterObjectKeysFromStructure(staffData, ['index', 'notes', 'span'])
        return result.sort((a, b) => a.name - b.name)
    }, [staffData]);

    const [isLoading, setLoading] = useState(false)
    const [loadValue, setLoadValue] = useState({ current: 0, total: 0 })

    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = async (importedData) => {
        setLoading(true)
        setLoadValue({ current: 0, total: importedData.length })

        const newRoles = []
        importedData.forEach((fragment, index) => {
            if (
                fragment.charge &&
                fragment.charge.trim().length > 0 &&
                !roleList.includes(fragment.charge) &&
                !newRoles.includes(fragment.charge)
            ) {
                newRoles.push(fragment.charge)
            }

            if (!fragment['currency']) {
                importedData[index]['currency'] = 'CUP'
            }

            fragment.salary = parseInt(fragment.salary)
            fragment['notes'] = []

            setLoadValue(prev => ({ ...prev, current: prev.current + 1 }))
        })

        for (let index = 0; index < newRoles.length; index++) {
            await addRole({ name: newRoles[index], color: randomLCH() })
        }

        const result = [...staffData, ...importedData]
        overwriteFile(result)

        loadRoles()
        setLoading(false)
    }

    useEffect(() => {
        (
            async () => {
                setLoading(true)
                await loadData()
                await loadRoles()
            }
        )()
            .then(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isLoading) {
            closeDialog()
            return
        }

        openDialog(
            <LoadingDialog
                current={loadValue.current}
                total={loadValue.total}
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, loadValue])

    return (
        <section className="
        grid grid-cols-3 grid-rows-1 
        h-full
        p-4! gap-3
        ">


            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">

                <div className="
                flex flex-row 
                gap-2 py-2! px-4! 
                justify-between
                ">
                    <SearchBar onSearch={query => setQuery(query)} />
                    <DropdownMenu
                        elements={roles}
                        onSelected={filter => setFilter(filter)}
                    />
                </div>

                <div className="
                flex flex-col
                overflow-y-auto
                ">
                    <div className="
                    grid
                    w-full
                    px-4! py-2! gap-4
                    ">

                        <div>
                            <ImportPanel
                                model={{
                                    "name": "Nombre",
                                    "ID": "Carnet de identidad",
                                    "salary": "Salario",
                                    "currency": "Moneda de pago",
                                    "charge": "Cargo",
                                    "contact": "Numero telefoníco",
                                    "startDate": "Inicio decontrato",
                                    "endDate": "Fin de contrato"
                                }}
                                optionalFields={["currency", "charge", "contact", "ID", "startDate", "endDate"]}
                                title="Importar"
                                onImport={data => handleImportation(data)}
                                previewComponent={({ data }) => <EmployeItem data={data} isOnPreview={true} />}
                                exportData={exportedData}
                            />
                        </div>

                        <div className="flex flex-row gap-1">
                            <TotalWasteDisplay
                                elements={staffData}
                                wasteKey="salary"
                            />
                        </div>
                    </div>

                    <ItemsList>
                        {filteredList.map((member, index) =>
                            <EmployeItem
                                key={index}
                                data={{ index: index, ...member }} />
                        )}
                    </ItemsList>
                </div>
            </div>

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            overflow-y-auto
            ">
                <EmployeForm onSubmit={data => addStaff(data)} />
            </div>

        </section>
    )
}

export default StaffView