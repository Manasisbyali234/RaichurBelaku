import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Save newspaper to Firestore
export const saveNewspaper = async (newspaper) => {
  try {
    const docRef = await addDoc(collection(db, 'newspapers'), {
      ...newspaper,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving newspaper:', error);
    throw error;
  }
};

// Get all newspapers
export const getNewspapers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'newspapers'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting newspapers:', error);
    return [];
  }
};

// Upload PDF file to Firebase Storage
export const uploadPDF = async (file, filename) => {
  try {
    const storageRef = ref(storage, `pdfs/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Update newspaper areas
export const updateNewspaperAreas = async (newspaperId, areas) => {
  try {
    const docRef = doc(db, 'newspapers', newspaperId);
    await updateDoc(docRef, { areas });
  } catch (error) {
    console.error('Error updating areas:', error);
    throw error;
  }
};