import FormInput from "./FormInput"
import DatePicker from "./DatePicker"
import { useState } from "react"
import useStaffStore from "../stores/staffStore"
import useAlertStore from "../stores/alertStore"
import ErrorToast from "./ErrorToast"
import DefaultButton from "./DefaultButton"
import PreferenceSwitch from "./PreferenceSwitch"
import TagSelector from "./TagSelector"
import CurrencySelector from "./CurrencySelector"

function EmployeForm({ onSubmit }) {
    let oneMonthSpan = new Date()
    oneMonthSpan.setMonth(oneMonthSpan.getMonth() + 1)
    oneMonthSpan = oneMonthSpan.toLocaleDateString('sv-SE')

    const { staffData } = useStaffStore()
    const { addAlert } = useAlertStore()

    const [isPermantent, setPermanent] = useState(false)

    const [formData, setFormData] = useState({
        "name": "",
        "ID": "",
        "salary": 0,
        "currency": "CUP",
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

            <TagSelector
                useRoles
                onChange={
                    data => setFormData(prev => ({ ...prev, charge: data }))
                } />

            <FormInput label="Salario base" placeholder="Salario del empleado..." type="number"
                onChange={data => setFormData(prev => ({ ...prev, salary: data }))} />

            <CurrencySelector
                current={formData.currency}
                onChange={data => setFormData(prev => ({ ...prev, currency: data }))}
            />

            <PreferenceSwitch name="Contrato permanente" value={isPermantent} onChange={data => setNullable(data)} />

            <DatePicker label="Inicio de contrato"
                onChange={data => setFormData(prev => ({ ...prev, startDate: data }))} />

            {!isPermantent &&
                <DatePicker
                    label="Fin de contrato"
                    value={oneMonthSpan}
                    onChange={data => setFormData(prev => ({ ...prev, endDate: data }))}
                    required={false}
                />
            }
        </form>
    )
}
export default EmployeForm