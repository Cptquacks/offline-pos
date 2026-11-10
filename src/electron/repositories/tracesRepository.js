import { desc, eq } from "drizzle-orm";
import { traces } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

function getToday() {
    return new Date().toLocaleDateString("sv-SE");
}

const traceRelations = {
    tickets: {
        with: {
            items: true,
        },
    },
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.traces.findMany({
        with: withRelations ? traceRelations : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb();
    return db.query.traces.findMany({
        with: withRelations ? traceRelations : undefined,
        orderBy: { createdAt: "desc" },
        limit: limit > 0 ? limit : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.traces.findFirst({
        where: (trace, { eq }) => eq(trace.id, id),
        with: withRelations ? traceRelations : undefined,
    });
}

export function findByDate(date, withRelations = false) {
    const db = getDb();
    return db.query.traces.findMany({
        where: (trace, { eq }) => eq(trace.date, date),
        with: withRelations ? traceRelations : undefined,
    });
}

export function getOrCreateToday() {
    const db = getDb();
    const today = getToday();

    return db.transaction((tx) => {
        const existingTrace = tx.select()
            .from(traces)
            .where(eq(traces.date, today))
            .orderBy(desc(traces.createdAt))
            .get();

        if (existingTrace) return existingTrace;

        return tx.insert(traces)
            .values({ date: today })
            .returning()
            .get();
    });
}

export function create(trace) {
    const db = getDb();
    return db.insert(traces).values(trace).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, ...safe } = patch;
    const db = getDb();
    return db.update(traces)
        .set(safe)
        .where(eq(traces.id, id))
        .returning()
        .get();
}
