import { useEffect, useState } from "react"
import EmployeList from "../components/EmployeList"
import EmployeForm from "../components/EmployeForm"
import SearchBar from "../components/SearchBar"
import TagFilter from "../components/TagFilter"
import ImportPanel from "../components/ImportPanel"

function EmployeView() {

    const [employeData, setEmployeData] = useState([])
    const [salaryTotal, setTotal] = useState(0)

    const handleSubmition = async (data) => {
        if (!window.electronAPI) return
        await window.electronAPI.modifyJSON('employees.json', data)
            .then(res => console.log(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('employees.json')
            .then(res => setEmployeData(res))
            .catch(err => console.error(err))
    }

    const handleDeletion = async (target) => {
        const data = employeData.filter((_, index) => index !== target)

        if (!window.electronAPI) return
        await window.electronAPI.writeJSON('employees.json', data)
            .then(res => console.log(res))
            .catch(err => console.error(err))

        await window.electronAPI.readJSON('employees.json')
            .then(res => setEmployeData(res))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (!window.electronAPI) return
        async function awaitAPI() {
            await window.electronAPI.readJSON('employees.json')
                .then(res => setEmployeData(res))
                .catch(err => console.error(err))
        }
        awaitAPI()
    }, [])

    useEffect(() => {
        let total = 0
        employeData.forEach(employe =>
            total = parseInt(total + parseInt(employe.salary))
        )

        function setter() { /* This wrapper is suppose to simplify a useless subscription */
            setTotal(total)
        }
        setter()
    }, [employeData])

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
                            Empleados: {employeData.length}
                        </p>

                        <p className="
                        font-bold!
                        w-fit
                        px-2! py-1!
                        bg-(--bg-alt)
                        border border-(--border)
                        rounded-md
                        ">
                            Gasto de salarios: {salaryTotal}
                        </p>
                    </div>
                </div>
                <EmployeList data={employeData} onDelete={index => handleDeletion(index)} />
            </div>

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            overflow-y-scroll
            ">
                <EmployeForm onSubmit={data => handleSubmition(data)} />
            </div>

        </section>
    )
}

export default EmployeView