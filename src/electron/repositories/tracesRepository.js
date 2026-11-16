import { desc, eq } from "drizzle-orm";
import { traces } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

function today() {
    return new Date().toLocaleDateString("sv-SE");
}

const traceRelations = {
    tickets: {
        with: {
            items: {
                with: {
                    product: true,
                },
            },
        },
    },
};

export function listAll(withRelations = false) {
    return getDb().query.traces.findMany({
        with: withRelations ? traceRelations : undefined,
        orderBy: { date: "desc" },
    });
}

export function list(withRelations = false, limit = 10) {
    return getDb().query.traces.findMany({
        with: withRelations ? traceRelations : undefined,
        orderBy: { date: "desc" },
        limit: limit > 0 ? limit : undefined,
    });
}

export function findById(id, withRelations = false) {
    return getDb().query.traces.findFirst({
        where: (trace, { eq: equals }) => equals(trace.id, id),
        with: withRelations ? traceRelations : undefined,
    });
}

export function findByDate(date, withRelations = false) {
    return getDb().query.traces.findMany({
        where: (trace, { eq: equals }) => equals(trace.date, date),
        with: withRelations ? traceRelations : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export function getOrCreateToday() {
    const db = getDb();
    const date = today();

    return db.transaction((tx) => {
        const existing = tx.select().from(traces)
            .where(eq(traces.date, date))
            .orderBy(desc(traces.createdAt))
            .all()
            .find((trace) => !trace.isClosed);
        if (existing) return existing;
        return tx.insert(traces).values({ date }).returning().get();
    });
}

export function create(trace) {
    const { id: _id, createdAt: _createdAt, tickets: _tickets, ...values } = trace;
    return getDb().insert(traces).values(values).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, tickets: _tickets, ...safe } = patch;
    return getDb().update(traces).set(safe)
        .where(eq(traces.id, id)).returning().get();
}

export function close(id) {
    return update(id, { isClosed: 1 });
}

export function upsertManualMany(entries) {
    const db = getDb();
    return db.transaction((tx) => entries.map((entry) => {
        const values = {
            refunds: Number(entry.refunds) || 0,
            sells: Number(entry.sells) || 0,
            total: entry.total ?? {},
        };
        if (entry.id !== undefined) {
            const updated = tx.update(traces)
                .set(values)
                .where(eq(traces.id, entry.id))
                .returning()
                .get();
            if (!updated) throw new Error(`No se encontró la traza ${entry.id}.`);
            return updated;
        }
        return tx.insert(traces).values({
            date: entry.date,
            ...values,
            isClosed: 1,
        }).returning().get();
    }));
}
