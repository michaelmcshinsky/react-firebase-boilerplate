const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const seeds = require("./seeds");

admin.initializeApp();

const db = admin.firestore();

const validateFirebaseIdToken = (req, res, next) => {
	cors(req, res, () => {
		const idToken = req.headers.authorization.split("Bearer ")[1];
		admin
			.auth()
			.verifyIdToken(idToken)
			.then((decodedIdToken) => {
				console.log("ID Token correctly decoded", decodedIdToken);
				req.user = decodedIdToken;
				return next();
			})
			.catch((error) => {
				console.error("Error while verifying Firebase ID token:", error);
				res.status(403).send("Unauthorized");
			});
	});
};

exports.createUser = functions.auth.user().onCreate((user) => {
	return db.doc(`users/${user.uid}`).set({
		id: user.uid,
		email: user.email,
		displayName: user.displayName,
		roles: [],
		active: true,
	});
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
	return db.doc(`users/${user.uid}`).update({
		active: false,
	});
});

exports.seed = functions.https.onRequest((req, res, next) => {
	validateFirebaseIdToken(req, res, () => {
		seeds.forEach((seed) => {
			seedFirestoreDocument(seed, res);
		});
	});
});

function seedFirestoreDocument(seed, res) {
	let batch = db.batch();

	try {
		const ref = db.collection(seed.collection);

		seed.docs.forEach((doc) => {
			let docRef = ref.doc(doc.name);
			batch.set(docRef, doc.value);
		});

		return batch
			.commit()
			.then(() => {
				return res.status(200).send({ message: "success" });
			})
			.catch((error) => {
				return res.status(500).send({ message: error });
			});
	} catch (error) {
		return res.status(500).send({ message: error });
	}
}
