import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Account } from '../../types/finance';

const COLLECTION_NAME = 'accounts';

export const accountsService = {
  async create(account: Omit<Account, 'id'>): Promise<Account> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...account,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...account
    };
  },

  async update(id: string, data: Partial<Account>): Promise<void> {
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

  async getAll(): Promise<Account[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Account));
  },

  async getByType(type: Account['type']): Promise<Account[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('type', '==', type)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Account));
  }
};