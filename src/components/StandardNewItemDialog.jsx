import { useMemo, useState } from "react"
import DialogTopBar from "./DialogTopBar"
import FormInput from "./FormInput"
import TagSelector from "./TagSelector"
import PriceSelectionInput from "./PriceSelectionInput"
import CurrencySelector from "./CurrencySelector"
import ExpirationSelector from "./ExpirationSelector"
import DatePicker from "./DatePicker"
import DefaultButton from "./DefaultButton"
import useDialogStore from "../stores/dialogStore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PhoneList from "./PhoneList"
import ActiveSwitch from "./ActiveSwitch"

function StandarNewItemDialog(
    {
        label, icon,
        fileFields, uiFields, optionalFields, currentFieldData,
        // eslint-disable-next-line no-unused-vars
        additionCallback, alertCallback
    }
) {
    const { closeDialog } = useDialogStore()
    const today = new Date().toLocaleDateString('sv-SE')
    const itemFields = useMemo(() => {
        let result = []
        const grouped = {}

        fileFields.forEach((field, index) => {
            grouped[index] = {
                'name': Object.keys(field)[0],
                'type': Object.values(field)[0],
                'uiName': Object.values(uiFields[index])[0],
                'value': currentFieldData ? currentFieldData[Object.keys(field)[0]] : ''
            }

        });

        result = Object.values(grouped)

        return result
    }, [fileFields, uiFields, currentFieldData])

    const [formData, setFormData] = useState(() => {
        const grouped = {}
        fileFields.forEach(field => {
            grouped[Object.keys(field)[0]] = currentFieldData ? currentFieldData[Object.keys(field)[0]] : null
        })
        return grouped
    })

    const editFormFields = (key, value) => {
        const result = { ...formData }
        result[key] = value
        setFormData(result)
        console.log(result)
    }

    const canAddItem = useMemo(() => {
        const requiredFields = fileFields.filter(field => !optionalFields.includes(Object.keys(field)[0])).map(field => Object.keys(field)[0])
        return requiredFields.every(field => formData[field] !== null)
    }, [formData, fileFields, optionalFields])

    return (
        <section
            className="
            flex flex-col
            border border-(--border)
            min-w-[50dvw] max-w-[90dvw]
            min-h-[50dvh] max-h-[90dvh]
            
            bg-(--bg)
            overflow-hidden
            rounded-md
            "
        >
            <DialogTopBar
                label={`Nuevo ${label}`}
            />

            <div
                className="
                flex flex-col
                gap-3 p-2!
                overflow-y-scroll
                "
            >
                <div className="flex flex-row gap-1 items-center">
                    <FontAwesomeIcon icon={`${icon}`} size="xl" />
                    <strong className="text-lg">
                        Los elementos obligatorios se destacan con un
                        <span className="text-red-400"> *</span>
                    </strong>

                </div>

                {itemFields.map(
                    (item, index) => {
                        switch (item.type) {
                            case "text":
                                return <FormInput
                                    key={index}
                                    label={item.uiName}
                                    defaultValue={item.value}
                                    placeholder={`${item.uiName} del ${label}`}
                                    onChange={value => editFormFields(item.name, value)}
                                    required={optionalFields.includes(item.name)}
                                />;

                            case "tag":
                                return <TagSelector
                                    key={index}
                                    onChange={value => editFormFields(item.name, value)}
                                />

                            case "tag-roles":
                                return <TagSelector
                                    key={index}
                                    useRoles
                                    onChange={value => editFormFields(item.name, value)}
                                />

                            case "number":
                                return <FormInput
                                    key={index}
                                    type="number"
                                    label={item.uiName}
                                    defaultValue={item.value}
                                    placeholder={`${item.uiName} del ${label}`}
                                    onChange={value => editFormFields(item.name, parseInt(value))}
                                    required={optionalFields.includes(item.name)}
                                />

                            case "phone-list":
                                return <PhoneList
                                    key={index}
                                    onChange={value => editFormFields(item.name, value)}
                                />

                            case "phone":
                                return <PhoneList
                                    key={index}
                                    single
                                    onChange={value => editFormFields(item.name, value)}
                                />

                            case "price":
                                return <PriceSelectionInput
                                    key={index}
                                    defaultValue={item.value}
                                    onChange={value => editFormFields(item.name, parseInt(value))}
                                />

                            case "currency":
                                return <CurrencySelector
                                    key={index}
                                    current={item.value}
                                    onChange={value => editFormFields(item.name, value)}
                                />

                            case "date":
                                return <DatePicker
                                    label={item.uiName}
                                    value={item.value ?? today}
                                    onChange={value => editFormFields(item.name, value)}
                                    required={optionalFields.includes(item.name)}
                                />
                            case "expiration":
                                return <ExpirationSelector
                                    key={index}
                                    label={item.uiName}
                                    defaultValue={item.value}
                                    onChange={value => editFormFields(item.name, value)}
                                    required={!optionalFields.includes(item.name)}
                                />

                            case "active":
                                return <ActiveSwitch
                                    defaultValue={item.value ?? true}
                                    onChange={value => editFormFields(item.name, value)}
                                    label={item.uiName}
                                />

                            default:
                                return <p>Error de programacion. Campo no esperado {item.name} {item.type} at {index}</p>;
                        }
                    }
                )}
            </div>

            <footer
                className="
                flex flex-row
                items-center justify-end
                bg-(--bg-alt)
                p-2!
                border-t border-t-white/5
                "
            >
                <DefaultButton
                    label={currentFieldData ? 'Editar' : 'Añadir'}
                    icon={currentFieldData ? 'pen-to-square' : 'check'}
                    disabled={!canAddItem}
                    onClick={() => {
                        additionCallback(formData)
                        closeDialog()
                    }}
                />
            </footer>
        </section>
    )
}
export default StandarNewItemDialog