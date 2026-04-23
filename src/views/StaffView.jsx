import { useEffect } from "react"
import EmployeForm from "../components/EmployeForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"
import ItemsList from "../components/ItemsList"
import useStaffStore from "../stores/staffStore"
import EmployeItem from "../components/EmployeItem"

function StaffView() {
    const { staffData, salaryWaste, loadData, addStaff, deleteStaff } = useStaffStore()
    useEffect(() => {
        loadData()
    })

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
                w-fit
                px-4! py-2! gap-4
                ">

                    <div className="flex flex-row gap-2 justify-between">
                        <SearchBar />
                        <TagFilter />
                    </div>

                    <div>
                        <ImportPanel />
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
                            Gasto de salarios: {salaryWaste}
                        </p>
                    </div>
                </div>

                <ItemsList>
                    {staffData.map((member, index) =>
                        <EmployeItem key={index} data={{ index: index, ...member }}
                            onDelete={index => deleteStaff(index)} />
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