import { eq, inArray } from "drizzle-orm";
import { contacts, staff } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const staffRelations = {
    contacts: true,
    notes: true,
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.staff.findMany({
        orderBy: { createdAt: "desc" },
        with: withRelations ? staffRelations : undefined,
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb();
    return db.query.staff.findMany({
        with: withRelations ? staffRelations : undefined,
        limit: limit > 0 ? limit : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.staff.findFirst({
        where: (member, { eq }) => eq(member.id, id),
        with: withRelations ? staffRelations : undefined,
    });
}

export function findByName(name, withRelations = false) {
    const db = getDb();
    return db.query.staff.findMany({
        where: (member, { like }) => like(member.name, `%${name}%`),
        with: withRelations ? staffRelations : undefined,
    });
}

export function findByRole(role, withRelations = false) {
    const db = getDb();
    return db.query.staff.findMany({
        where: (member, { eq, isNull }) => role == null
            ? isNull(member.role)
            : eq(member.role, role),
        with: withRelations ? staffRelations : undefined,
    });
}

export function create(member) {
    const db = getDb();
    const { contacts: memberContacts = [], ...values } = member;
    return db.transaction((tx) => {
        const created = tx.insert(staff).values(values).returning().get();
        for (const contact of memberContacts) {
            tx.insert(contacts).values({ ...contact, staffId: created.id }).run();
        }
        return tx.query.staff.findFirst({
            where: (row, { eq: equals }) => equals(row.id, created.id),
            with: staffRelations,
        });
    });
}

export function createMany(members) {
    if (!Array.isArray(members) || members.length === 0) return [];
    const db = getDb();
    return db.transaction((tx) => members.map((member) => {
        const { contacts: memberContacts = [], ...values } = member;
        const created = tx.insert(staff).values(values).returning().get();
        for (const contact of memberContacts) {
            tx.insert(contacts).values({ ...contact, staffId: created.id }).run();
        }
        return created;
    }));
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, contacts: memberContacts, ...safe } = patch;
    const db = getDb();
    return db.transaction((tx) => {
        const updated = tx.update(staff)
            .set(safe)
            .where(eq(staff.id, id))
            .returning()
            .get();
        if (!updated) return undefined;
        if (memberContacts !== undefined) {
            tx.delete(contacts).where(eq(contacts.staffId, id)).run();
            for (const contact of memberContacts) {
                tx.insert(contacts).values({ ...contact, staffId: id }).run();
            }
        }
        return tx.query.staff.findFirst({
            where: (row, { eq: equals }) => equals(row.id, id),
            with: staffRelations,
        });
    });
}

export function remove(id) {
    const db = getDb();
    return db.delete(staff).where(eq(staff.id, id)).returning().get();
}

export function removeMany(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return getDb().delete(staff).where(inArray(staff.id, ids)).returning().all();
}
