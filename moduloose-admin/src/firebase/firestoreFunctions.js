import { myFirestore } from './config.js'

export const uploadFirestore = (collection, doc) => {
    myFirestore.collection(collection).doc(doc.id).set(doc).then(()=>console.log("document uploaded to firestore")).catch(function(error) {
        console.error("Error writing document: ", error);
    });;
}

export const deleteFirestore = (collection, id) => {
    myFirestore.collection(collection).doc(id).delete().then(()=>console.log("document deleted from firestore")).catch(function(error) {
        console.error("Error deleting document: ", error);
    });;
}