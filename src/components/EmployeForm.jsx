import FormInput from "./FormInput"
import DatePicker from "./DatePicker"
import { useState } from "react"
import ChargeSelector from "./ChargeSelector"
import useStaffStore from "../stores/staffStore"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "./ErrorToast"
import DefaultButton from "./DefaultButton"
import PreferenceSwitch from "./PreferenceSwitch"

function EmployeForm({ onSubmit }) {
    const { staffData } = useStaffStore()
    const { addAlert } = useAlertStore()

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
        if (member.length > 0) {
            addAlert(
                <ErrorToast
                    label="CI Duplicado" />
            )
            return
        }
        onSubmit(formData)
    }

    const setNullable = (data) => {
        if (data)
            setFormData(prev => ({ ...prev, endDate: null }))

        if (!data) {
            setFormData(prev => ({ ...prev, endDate: new Date().toLocaleDateString('sv-SE') }))
        }

        setPermanent(data)
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

                <DefaultButton label="Añadir" icon="plus" type="submit" iconLeft />
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

            <p>{formData.endDate}</p>
            <PreferenceSwitch name="Contrato permanente" value={isPermantent} onChange={data => setNullable(data)} />

            <DatePicker label="Inicio de contrato"
                onChange={data => setFormData(prev => ({ ...prev, startDate: data }))} />

            {!isPermantent &&
                <DatePicker label="Fin de contrato"
                    onChange={data => setFormData(prev => ({ ...prev, endDate: data }))} required={false} />}
        </form>
    )
}
export default EmployeForm