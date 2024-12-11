import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Vendor } from '../../types/finance';

const COLLECTION_NAME = 'vendors';

export const vendorsService = {
  async create(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...vendor,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...vendor
    };
  },

  async update(id: string, data: Partial<Vendor>): Promise<void> {
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

  async getAll(): Promise<Vendor[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Vendor));
  }
};