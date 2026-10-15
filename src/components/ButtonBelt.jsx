function ButtonBelt({ children }) {
    return (
        <section className="flex flex-row flex-wrap items-center gap-3">

            <div
                className="
                flex flex-row 
                items-center
                gap-2 p-2!
                bg-(--bg-alt)
                border border-white/10
                rounded-md
                "
            >
                {children}
            </div>
        </section>
    )
}
export default ButtonBelt