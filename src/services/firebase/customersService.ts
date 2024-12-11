import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Customer } from '../../types/finance';

const COLLECTION_NAME = 'customers';

export const customersService = {
  async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...customer
    };
  },

  async update(id: string, data: Partial<Customer>): Promise<void> {
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

  async getAll(): Promise<Customer[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Customer));
  }
};