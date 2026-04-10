function ResumeView() {
    return (
        <section className="
        grid grid-cols-3 grid-rows-3
        h-full 
        gap-3 p-4!
        ">
            <div className="
            flex flex-col 
            col-span-2 row-span-2
            bg-(--bg-soft)!
            rounded-md
            ">
                STATS
            </div>

            <div className="
            flex flex-col 
            row-span-3
            bg-(--bg-soft)!
            rounded-md
            ">
                EMPLOYES
            </div>

            <div className="
            flex flex-col 
            col-span-2
            bg-(--bg-soft)!
            rounded-md
            ">
                PRODUCTS
            </div>
        </section>
    )
}
export default ResumeView