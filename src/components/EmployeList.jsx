import EmployeItem from "./EmployeItem"
import EmptyList from "./EmptyList"

function EmployeList({ data, onDelete }) {
    return (
        <div className="
        flex flex-col
        p-4! gap-2
        ">
            {data.length === 0 &&
                <EmptyList />}
            {data.map((item, index) =>
                <EmployeItem key={index} data={{ index: index, ...item }} onDelete={index => onDelete(index)} />
            )}
        </div>
    )
}
export default EmployeList