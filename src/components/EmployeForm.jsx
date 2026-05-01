import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormInput from "./FormInput"
import DatePicker from "./DatePicker"
import { useState } from "react"
import ChargeSelector from "./ChargeSelector"
import useStaffStore from "../stores/staffStore"

function EmployeForm({ onSubmit }) {
    const { staffData } = useStaffStore()
    const [isPermantent, setPermanent] = useState(false)

    const [formData, setFormData] = useState({
        "name": "",
        "ID": "",
        "salary": 0,
        "charge": "",
        "contact": "",
        "startDate": new Date().toLocaleDateString('sv-SE'),
        "endDate": null,
        "notes": []
    })

    const handleSubmition = () => {
        const member = staffData.filter(member => member.ID === formData.ID)
        if (member.length > 0) return
        onSubmit(formData)
    }

    const setNullable = () => {
        if (!isPermantent)
            setFormData(prev => ({ ...prev, endDate: null }))
    }

    return (
        <form onSubmit={handleSubmition} className="
        flex flex-col
        p-4! gap-3
        ">
            <div className="
            flex flex-row
            justify-between items-start
            ">
                <p className="font-bold! text-xl">
                    Formulario de empleado
                </p>

                <button className="
                transition-normal cursor-pointer
                flex flex-row
                items-center
                px-3! py-1! gap-1
                font-bold
                bg-(--accent-alt) hover:bg-white
                text-white! hover:text-(--bg)!
                rounded-xs
                ">
                    Añadir
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            <FormInput label="Nombre " placeholder="Nombre del empleado..." type="text"
                onChange={data => setFormData(prev => ({ ...prev, name: data }))} />

            <FormInput label="Carnet de Identidad" placeholder="CI del empleado..." type="text"
                onChange={data => setFormData(prev => ({ ...prev, ID: data }))} />

            <FormInput label="Telefono de contacto" placeholder="Telefono del empleado..." type="tel"
                onChange={data => setFormData(prev => ({ ...prev, contact: data }))} />

            <ChargeSelector onChange={
                data => setFormData(prev => ({ ...prev, charge: data }))
            } />

            <FormInput label="Salario base (CUP)" placeholder="Salario del empleado..." type="number"
                onChange={data => setFormData(prev => ({ ...prev, salary: data }))} />

            <div className="
            flex flex-row
            items-center
            font-bold!
            px-4! py-2! gap-1 mt-6!
            bg-(--bg-alt)
            border border-(--border)
            rounded-md
            ">
                <input id="permanence" type="checkbox"
                    checked={isPermantent} onChange={event => {
                        setPermanent(event.target.checked)
                        setNullable()
                    }} />
                <label htmlFor="permanence">
                    Contrato permanente
                </label>
            </div>

            <DatePicker label="Inicio de contrato"
                onChange={data => setFormData(prev => ({ ...prev, startDate: data }))} />

            {!isPermantent &&
                <DatePicker label="Fin de contrato"
                    onChange={data => setFormData(prev => ({ ...prev, endDate: data }))} required={false} />}
        </form>
    )
}
export default EmployeForm