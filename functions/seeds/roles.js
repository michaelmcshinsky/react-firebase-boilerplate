const type = "firestore";
const collection = "roles";
const docs = [
	{ name: "admin", value: { displayName: "Admin", active: true, system: true } },
	{ name: "owner", value: { displayName: "Owner", active: true, system: true } },
	{ name: "user", value: { displayName: "User", active: true, system: true } },
];

module.exports = {
	type: type,
	collection: collection,
	docs: docs,
};
