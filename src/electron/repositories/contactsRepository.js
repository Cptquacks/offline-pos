import { eq } from "drizzle-orm";
import { contacts } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const contactRelations = {
    staff: true,
    provider: true,
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.contacts.findMany({
        with: withRelations ? contactRelations : undefined,
        orderBy: { createdAt: "desc" },
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb();
    return db.query.contacts.findMany({
        with: withRelations ? contactRelations : undefined,
        orderBy: { createdAt: "desc" },
        limit: limit > 0 ? limit : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.contacts.findFirst({
        where: (contact, { eq }) => eq(contact.id, id),
        with: withRelations ? contactRelations : undefined,
    });
}

export function findByStaffId(staffId, withRelations = false) {
    const db = getDb();
    return db.query.contacts.findMany({
        where: (contact, { eq, isNull }) => staffId == null
            ? isNull(contact.staffId)
            : eq(contact.staffId, staffId),
        with: withRelations ? contactRelations : undefined,
    });
}

export function findByProviderId(providerId, withRelations = false) {
    const db = getDb();
    return db.query.contacts.findMany({
        where: (contact, { eq, isNull }) => providerId == null
            ? isNull(contact.providerId)
            : eq(contact.providerId, providerId),
        with: withRelations ? contactRelations : undefined,
    });
}

export function create(contact) {
    const db = getDb();
    return db.insert(contacts).values(contact).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, ...safe } = patch;
    const db = getDb();
    return db.update(contacts)
        .set(safe)
        .where(eq(contacts.id, id))
        .returning()
        .get();
}
