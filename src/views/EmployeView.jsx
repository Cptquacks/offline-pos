function EmployeView() {
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
                EMPLOYE
            </div>

            <div className="
            flex flex-col 
            bg-(--bg-soft)!
            rounded-md
            ">
                EMPLOYE FORM
            </div>

        </section>
    )
}

export default EmployeView