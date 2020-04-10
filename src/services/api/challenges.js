export const getChallenges = async (firebase, uid) => {
  if (!firebase && !uid) return;
  return await firebase.db
    .collection('challenges')
    .where('userId', '==', uid)
    .get()
    .then(querySnapshot => {
      let challenges = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      return challenges;
    })
    .catch(function(error) {
      console.log('Error getting challenges: ', error);
    });
};
