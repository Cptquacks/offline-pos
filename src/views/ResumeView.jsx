import { faArrowLeft, faArrowRight, faDizzy, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

function ResumeView() {

    const [isLoading, setLoading] = useState(true)
    const [chartData, setChartData] = useState([])
    const [weekIndex, setWeekIndex] = useState(0)

    const weekData = useMemo(() => {
        if (!chartData.length || !chartData[weekIndex]) return [];

        const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        const currentWeek = chartData[weekIndex]

        return currentWeek.map((day, index) => ({
            name: DAY_NAMES[index],
            ventas: day.sells || 0,
            devoluciones: day.refunds || 0,
            totalCUP: day.total?.CUP || 0,
            totalUSD: day.total?.USD || 0,
            total: (day.total?.CUP + (day.total?.USD * 525)) || 0
        }));
    }, [chartData, weekIndex])

    /**
     * Data loader
     */
    const loadChartData = async () => {
        if (!window.electronAPI) return

        await window.electronAPI.readJSON('weeks.json')
            .then(res => { setChartData(res), console.log(res) })
            .catch(err => console.error(err))

        setLoading(false)
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { loadChartData() }, [])

    return (
        <section className="
        grid grid-cols-3 grid-rows-4
        h-full 
        gap-3 p-4!
        ">
            <div className="
            flex flex-col 
            col-span-2 row-span-3
            p-4! gap-6
            bg-(--bg-soft)!
            rounded-md
            ">
                <div className="flex flex-row items-start justify-between">
                    <p className="
                    font-bold! text-2xl
                    ">
                        Estadísticas
                    </p>

                    <div className="
                        flex flex-row
                        items-center
                        w-fit
                        p-2! gap-3
                        bg-(--bg)
                        border border-white/20
                        rounded-md
                        ">
                        <button className="
                            transition
                            p-2! py-1.5!
                            bg-(--accent-alt) hover:bg-white
                            text-white hover:text-(--bg-alt)
                            rounded-xs
                            ">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>

                        <p className="
                            text-lg
                            ">
                            Semana <strong>{weekIndex + 1}</strong>
                        </p>

                        <button className="
                            transition
                            p-2! py-1.5!
                            bg-(--accent-alt) hover:bg-white
                            text-white hover:text-(--bg-alt)
                            rounded-xs
                            ">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>

                {weekData.length === 0 &&
                    <div className="
                    flex flex-row 
                    self-center justify-self-center
                    items-center w-fit
                    p-6! gap-2
                    bg-(--bg)
                    opacity-50
                    border-2 border-dashed border-white/50
                    ">
                        {!isLoading &&
                            <p className="text-2xl font-bold!">
                                No hay datos que mostrar
                            </p>
                        }
                        <FontAwesomeIcon icon={isLoading ? faSpinner : faDizzy} size="2x" spinPulse={isLoading} />

                    </div>
                }

                {weekData.length !== 0 &&
                    <div className="
                    flex flex-col
                    justify-between
                    h-full
                    ">

                        <LineChart
                            style={{ width: '100%', aspectRatio: 3, maxWidth: 600 }}
                            data={weekData}>

                            <CartesianGrid
                                strokeDasharray="5 5" />

                            <Line name="CUP" dataKey="totalCUP" />
                            <Line name="USD" dataKey="totalUSD" stroke="lightgreen" />

                            <XAxis dataKey="name" />
                            <YAxis name="Ganancia" dataKey="totalCUP" />

                            <Tooltip />
                            <Legend />

                        </LineChart>

                        <BarChart
                            style={{ width: '100%', aspectRatio: 3, maxWidth: 600 }}
                            data={weekData}>

                            <CartesianGrid
                                strokeDasharray="5 5" />

                            <Bar dataKey="ventas" fill="var(--accent)" />
                            <Bar dataKey="devoluciones" fill="lightgreen" />

                            <XAxis dataKey="name" />
                            <YAxis dataKey="ventas" />

                            <Tooltip />
                            <Legend />

                        </BarChart>
                    </div>
                }
            </div>

            <div className="
            flex flex-col 
            row-span-4
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