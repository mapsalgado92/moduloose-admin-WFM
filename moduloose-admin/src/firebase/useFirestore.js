import { useState , useEffect } from 'react'
import { myFirestore } from '../firebase/config.js'

export const useFirestore = (collectionName) => {
    const [docs , setDocs] = useState([]);
    useEffect(()=>{
        const unsubscribe = myFirestore.collection(collectionName)
            .onSnapshot((snap)=>{
                let newDocs = [];
                snap.forEach(doc=>{
                    newDocs.push({...doc.data(), id: doc.id})
                })
                setDocs(newDocs);
            })
        return () => unsubscribe();
    }, [collectionName]);

    return docs;
}