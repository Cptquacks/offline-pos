import { eq } from "drizzle-orm";
import { staff } from "../db/schema.js";
import { getDb } from "../services/dbService.js";

const staffRelations = {
    contacts: true,
};

export function listAll(withRelations = false) {
    const db = getDb();
    return db.query.staff.findMany({
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
    return db.insert(staff).values(member).returning().get();
}

export function update(id, patch) {
    const { id: _id, createdAt: _createdAt, ...safe } = patch;
    const db = getDb();
    return db.update(staff)
        .set(safe)
        .where(eq(staff.id, id))
        .returning()
        .get();
}

export function remove(id) {
    const db = getDb();
    return db.delete(staff).where(eq(staff.id, id)).returning().get();
}
