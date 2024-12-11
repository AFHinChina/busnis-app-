import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Document } from '../../types/documents';

const COLLECTION_NAME = 'documents';

export const documentsService = {
  async create(document: Omit<Document, 'id'>, file: File): Promise<Document> {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `documents/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Create document in Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...document,
      url,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...document,
      url
    };
  },

  async update(id: string, data: Partial<Document>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async getAll(): Promise<Document[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Document));
  },

  async getByCategory(category: Document['category']): Promise<Document[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Document));
  }
};