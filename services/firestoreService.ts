/**
 * Firestore Service Layer
 * Reusable CRUD operations for all collections
 */
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    QueryConstraint,
    DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

// Types
export interface QueryCondition {
    field: string;
    operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
    value: unknown;
}

export interface SortOption {
    field: string;
    direction?: 'asc' | 'desc';
}

/**
 * Create a new document with auto-generated ID
 */
export const createDocument = async <T extends DocumentData>(
    collectionName: string,
    data: T
): Promise<{ id: string } & T> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error(`Error creating ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Create or update a document with a specific ID
 */
export const setDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: T,
    merge = false
): Promise<{ id: string } & T> => {
    try {
        await setDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge });
        return { id: docId, ...data };
    } catch (error) {
        console.error(`Error setting ${collectionName}/${docId}:`, error);
        throw error;
    }
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string
): Promise<({ id: string } & T) | null> => {
    try {
        const docSnap = await getDoc(doc(db, collectionName, docId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as { id: string } & T;
        }
        return null;
    } catch (error) {
        console.error(`Error getting ${collectionName}/${docId}:`, error);
        throw error;
    }
};

/**
 * Get multiple documents with optional filtering, sorting, and limiting
 */
export const getDocuments = async <T extends DocumentData>(
    collectionName: string,
    conditions: QueryCondition[] = [],
    sortBy?: SortOption,
    limitCount?: number
): Promise<({ id: string } & T)[]> => {
    try {
        const constraints: QueryConstraint[] = [];

        // Add where clauses
        conditions.forEach(({ field, operator, value }) => {
            constraints.push(where(field, operator, value));
        });

        // Add sorting
        if (sortBy) {
            constraints.push(orderBy(sortBy.field, sortBy.direction || 'asc'));
        }

        // Add limit
        if (limitCount) {
            constraints.push(limit(limitCount));
        }

        const q = query(collection(db, collectionName), ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ({ id: string } & T)[];
    } catch (error) {
        console.error(`Error getting ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Update an existing document
 */
export const updateDocument = async <T extends Partial<DocumentData>>(
    collectionName: string,
    docId: string,
    data: T
): Promise<{ id: string } & T> => {
    try {
        await updateDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return { id: docId, ...data };
    } catch (error) {
        console.error(`Error updating ${collectionName}/${docId}:`, error);
        throw error;
    }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
    collectionName: string,
    docId: string
): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error(`Error deleting ${collectionName}/${docId}:`, error);
        throw error;
    }
};
