const db = new Map();

function saveDocument(collection, id, document) {
	if (!db.has(collection)) {
		db.set(collection, new Map());
	}
	db.get(collection).set(id, document);
}

function getDocument(collection, id) {
	if (db.has(collection) && db.get(collection).has(id)) {
		return db.get(collection).get(id);
	}
	return null;
}

function getAllDocuments(collection) {
	if (db.has(collection)) {
		return Array.from(db.get(collection).values());
	}
	return [];
}

function deleteDocument(collection, id) {
	if (db.has(collection)) {
		db.get(collection).delete(id);
	}
}

export const localDB = {
	save: (collection, id, document) => {
		saveDocument(collection, id, document);
	},
	get: (collection, id) => {
		return getDocument(collection, id);
	},
	getAll: (collection) => {
		return getAllDocuments(collection);
	},
	delete: (collection, id) => {
		deleteDocument(collection, id);
	},
};
