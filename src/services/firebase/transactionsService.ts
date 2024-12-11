import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where, orderBy, Timestamp, runTransaction } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Transaction } from '../../types/finance';

const COLLECTION_NAME = 'transactions';

export const transactionsService = {
  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      // Use a transaction to ensure atomicity
      return await runTransaction(db, async (transaction) => {
        // Get account reference
        const accountRef = doc(db, 'accounts', transaction.accountId);
        const accountDoc = await transaction.get(accountRef);

        if (!accountDoc.exists()) {
          throw new Error('Account not found');
        }

        // Convert Date to Firestore Timestamp
        const firestoreData = {
          ...transaction,
          date: Timestamp.fromDate(new Date(transaction.date)),
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date())
        };

        // Create new transaction document reference
        const transactionRef = doc(collection(db, COLLECTION_NAME));
        
        // Add transaction
        transaction.set(transactionRef, firestoreData);

        // Update account balance
        const accountData = accountDoc.data();
        const newBalance = transaction.type === 'income' 
          ? accountData.balance + transaction.amount
          : accountData.balance - transaction.amount;

        transaction.update(accountRef, { 
          balance: newBalance,
          lastSync: Timestamp.fromDate(new Date())
        });

        return {
          id: transactionRef.id,
          ...transaction,
          date: new Date(transaction.date)
        };
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Transaction>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  async getAll(): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate() // Convert Timestamp back to Date
        } as Transaction;
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async getByAccount(accountId: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('accountId', '==', accountId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as Transaction;
      });
    } catch (error) {
      console.error('Error fetching transactions by account:', error);
      throw error;
    }
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as Transaction;
      });
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }
};