const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('../us-code-hackathon-75c94c7a00ca.json');

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: "us-code-hackathon"
});

const db = getFirestore(app, 'us-code-hackathon');

// 컬렉션 생성
async function createCollection(col, doc) {
    const docRef = db.collection(col).doc(doc);
    
    await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815
    });
}

/**
 * 데이터 생성
 * @param { string } col 컬렉션명
 * @param { string } doc 문서명
 * @param { JSON } user 저장할 json 데이터
 */
async function setData(col = 'users', user) {
    const aTuringRef = db.collection(col).doc();
    
    await aTuringRef.set(user);
}

async function getData(col = 'users') {
    // 데이터 읽기
    const snapshot = await db.collection(col).get();
    // snapshot.forEach((doc) => {
    //   console.log(doc.id, '=>', doc.data());
    // });
    return snapshot;
}

module.exports = {
    createCollection,
    setData,
    getData
};