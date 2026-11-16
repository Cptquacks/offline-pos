import { eq, inArray } from "drizzle-orm";
import { contacts, providers } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const providerRelations = {
    contacts: true,
    notes: true,
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        orderBy: { createdAt: "desc" },
        with: withRelations ? providerRelations : undefined,
    });
}

export function list(withRelations = false, limit = 10) {
    const db = getDb();
    return db.query.providers.findMany({
        with: withRelations ? providerRelations : undefined,
        limit: limit > 0 ? limit : undefined,
    });
}

export function listActive(withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq }) => eq(provider.active, 1),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findById(id, withRelations = false) {
    const db = getDb();
    return db.query.providers.findFirst({
        where: (provider, { eq }) => eq(provider.id, id),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByName(name, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { like }) => like(provider.name, `%${name}%`),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByStartedAt(startedAt, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq, isNull }) => startedAt == null
            ? isNull(provider.startedAt)
            : eq(provider.startedAt, startedAt),
        with: withRelations ? providerRelations : undefined,
    });
}

export function findByEndsAt(endsAt, withRelations = false) {
    const db = getDb();
    return db.query.providers.findMany({
        where: (provider, { eq, isNull }) => endsAt == null
            ? isNull(provider.endsAt)
            : eq(provider.endsAt, endsAt),
        with: withRelations ? providerRelations : undefined,
    });
}

export function create(provider) {
    const db = getDb();
    const { contacts: providerContacts = [], ...values } = provider;
    return db.transaction((tx) => {
        const created = tx.insert(providers).values(values).returning().get();
        for (const contact of providerContacts) {
            tx.insert(contacts).values({ ...contact, providerId: created.id }).run();
        }
        return tx.query.providers.findFirst({
            where: (row, { eq }) => eq(row.id, created.id),
            with: providerRelations,
        });
    });
}

export function createMany(providerList) {
    if (!Array.isArray(providerList) || providerList.length === 0) return [];
    const db = getDb();
    return db.transaction((tx) => providerList.map((provider) => {
        const { contacts: providerContacts = [], ...values } = provider;
        const created = tx.insert(providers).values(values).returning().get();
        for (const contact of providerContacts) {
            tx.insert(contacts).values({ ...contact, providerId: created.id }).run();
        }
        return created;
    }));
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, contacts: providerContacts, ...safe } = patch;
    const db = getDb();
    return db.transaction((tx) => {
        const updated = tx.update(providers)
            .set(safe)
            .where(eq(providers.id, id))
            .returning()
            .get();
        if (!updated) return undefined;
        if (providerContacts !== undefined) {
            tx.delete(contacts).where(eq(contacts.providerId, id)).run();
            for (const contact of providerContacts) {
                tx.insert(contacts).values({ ...contact, providerId: id }).run();
            }
        }
        return tx.query.providers.findFirst({
            where: (row, { eq }) => eq(row.id, id),
            with: providerRelations,
        });
    });
}

export function remove(id) {
    const db = getDb();
    return db.delete(providers).where(eq(providers.id, id)).returning().get();
}

export function removeMany(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return getDb().delete(providers).where(inArray(providers.id, ids)).returning().all();
}
