import { useEffect, useMemo, useState } from "react"
import useRoleStore from "../stores/roleStore"
import TagItem from "./TagItem"

function ChargeSelector({ onChange }) {
    const { roleList, loadRoles } = useRoleStore()
    const [selectedCharge, setSelectedCharge] = useState('N/A')

    const currentTag = useMemo(() => {
        let tag = { name: selectedCharge, color: '0%,0,0' }
        const filteredTag = roleList.find(tag => tag.name === selectedCharge) ?? {}

        return { ...tag, ...filteredTag }
    }, [roleList, selectedCharge])

    const handleChange = (event) => {
        setSelectedCharge(event.target.value)
        onChange(event.target.value)
    }

    useEffect(() => {
        loadRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (roleList.length === 0) return
        onChange(roleList[0].name)
        setSelectedCharge(roleList[0].name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleList])

    return (
        <div className="
        flex flex-col
        p-4! gap-1
        bg-(--bg-soft)
        border border-(--border)
        rounded-md
        ">
            <div className="
            grid grid-cols-2
            items-start justify-between
            ">
                <p className="font-bold!">
                    Cargo del empleado
                </p>

                <TagItem label={currentTag.name} color={currentTag.color} icon={'user-tag'} />
            </div>

            <select value={selectedCharge} onChange={handleChange} className="
            px-2! py-0.5!
            bg-(--bg)
            border border-white/20
            rounded-sm
            ">
                <option value="N/A">Ninguno</option>

                {roleList.map((charge, index) =>
                    <option key={index} value={charge.name}>
                        {charge.name}
                    </option>
                )}
            </select>
        </div>
    )
}
export default ChargeSelector