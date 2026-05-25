import { useEffect, useMemo, useState } from "react"
import EmployeForm from "../components/EmployeForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"
import ItemsList from "../components/ItemsList"
import useStaffStore from "../stores/staffStore"
import EmployeItem from "../components/EmployeItem"
import { stringSimilarity } from "../utils/string-util"
import useRoleStore from "../stores/roleStore"
import { filterObjectKeysFromStructure } from "../utils/filter-util"
import { randomLCH } from "../utils/tag-util"

function StaffView() {
    const { staffData, salaryWaste, loadData, addStaff, overwriteFile } = useStaffStore()
    const { roleList, addRole, loadRoles } = useRoleStore()

    const roleNames = useMemo(() => {
        let result = roleList
        return result.map(role => role.name)
    }, [roleList])

    const [filter, setFilter] = useState('All')
    const [query, setQuery] = useState('')

    const filteredList = useMemo(() => {
        let result = staffData

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
        return filterObjectKeysFromStructure(staffData, ['index', 'notes'])
    }, [staffData]);

    /**
     * 
     * @param {Array} importedData 
     */
    const handleImportation = async (importedData) => {
        const newRoles = []
        importedData.forEach(fragment => {
            if (
                fragment.charge &&
                fragment.charge.trim().length > 0 &&
                !roleList.includes(fragment.charge) &&
                !newRoles.includes(fragment.charge)
            ) {
                newRoles.push(fragment.charge)
            }

            fragment.salary = parseInt(fragment.salary)
            fragment['notes'] = []
        })

        for (let index = 0; index < newRoles.length; index++) {
            await addRole({ name: newRoles[index], color: randomLCH() })
        }

        const result = [...staffData, ...importedData]
        overwriteFile(result)
        loadRoles()
    }

    useEffect(() => {
        loadData()
        loadRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            overflow-y-scroll
            ">
                <div className="grid
                w-full
                px-4! py-2! gap-4
                ">

                    <div className="flex flex-row gap-2 justify-between">
                        <SearchBar onSearch={query => setQuery(query)} />
                        <TagFilter filters={roleNames} onSelect={filter => setFilter(filter)} />
                    </div>

                    <div>
                        <ImportPanel
                            model={{
                                "name": "Nombre",
                                "ID": "Carnet de identidad",
                                "salary": "Salario",
                                "charge": "Cargo",
                                "contact": "Numero telefoníco",
                                "startDate": "Inicio decontrato",
                                "endDate": "Fin de contrato"
                            }}
                            optionalFields={["charge", "contact", "ID", "startDate", "endDate"]}
                            title="Importar"
                            onImport={data => handleImportation(data)}
                            previewComponent={({ data }) => <EmployeItem data={data} isOnPreview={true} />}
                            exportData={exportedData}
                        />
                    </div>

                    <div className="flex flex-row gap-1">
                        <p className="
                        font-bold!
                        w-fit
                        px-2! py-1!
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        ">
                            Empleados: {staffData.length}
                        </p>

                        <p className="
                        font-bold!
                        w-fit
                        px-2! py-1!
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        ">
                            Gasto de salarios: {salaryWaste} CUP
                        </p>
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

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            overflow-y-scroll
            ">
                <EmployeForm onSubmit={data => addStaff(data)} />
            </div>

        </section>
    )
}

export default StaffView