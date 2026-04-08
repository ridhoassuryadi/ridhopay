export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'guest';
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorRole: 'admin' | 'guest';
  createdAt: number;
  updatedAt: number;
}

export interface Debtor {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  id: string;
  debtorId: string;
  type: 'debt' | 'payment';
  amount: number;
  description: string;
  createdBy: string;
  createdAt: number;
}

export class KVStore {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  private getUsersKey(): string {
    return 'users';
  }

  private getNotesKey(): string {
    return 'notes';
  }

  private getDebtorsKey(): string {
    return 'debtors';
  }

  private getTransactionsKey(): string {
    return 'transactions';
  }

  async getUsers(): Promise<User[]> {
    const data = await this.env.KV.get(this.getUsersKey(), 'json');
    return data || [];
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.username === username) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.getUsers();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    users.push(newUser);
    await this.env.KV.put(this.getUsersKey(), JSON.stringify(users));
    return newUser;
  }

  async getNotes(): Promise<Note[]> {
    const data = await this.env.KV.get(this.getNotesKey(), 'json');
    return data || [];
  }

  async getNoteById(id: string): Promise<Note | null> {
    const notes = await this.getNotes();
    return notes.find(n => n.id === id) || null;
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    await this.env.KV.put(this.getNotesKey(), JSON.stringify(notes));
    return newNote;
  }

  async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await this.env.KV.put(this.getNotesKey(), JSON.stringify(notes));
    return notes[index];
  }

  async deleteNote(id: string): Promise<boolean> {
    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    await this.env.KV.put(this.getNotesKey(), JSON.stringify(filtered));
    return true;
  }

  async getDebtors(): Promise<Debtor[]> {
    const data = await this.env.KV.get(this.getDebtorsKey(), 'json');
    return data || [];
  }

  async getDebtorById(id: string): Promise<Debtor | null> {
    const debtors = await this.getDebtors();
    return debtors.find(d => d.id === id) || null;
  }

  async createDebtor(debtor: Omit<Debtor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Debtor> {
    const debtors = await this.getDebtors();
    const newDebtor: Debtor = {
      ...debtor,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    debtors.push(newDebtor);
    await this.env.KV.put(this.getDebtorsKey(), JSON.stringify(debtors));
    return newDebtor;
  }

  async updateDebtor(id: string, updates: Partial<Omit<Debtor, 'id' | 'createdAt'>>): Promise<Debtor | null> {
    const debtors = await this.getDebtors();
    const index = debtors.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    debtors[index] = {
      ...debtors[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await this.env.KV.put(this.getDebtorsKey(), JSON.stringify(debtors));
    return debtors[index];
  }

  async deleteDebtor(id: string): Promise<boolean> {
    const debtors = await this.getDebtors();
    const filtered = debtors.filter(d => d.id !== id);
    if (filtered.length === debtors.length) return false;
    await this.env.KV.put(this.getDebtorsKey(), JSON.stringify(filtered));
    
    const transactions = await this.getTransactions();
    const filteredTx = transactions.filter(t => t.debtorId !== id);
    await this.env.KV.put(this.getTransactionsKey(), JSON.stringify(filteredTx));
    
    return true;
  }

  async getTransactions(): Promise<Transaction[]> {
    const data = await this.env.KV.get(this.getTransactionsKey(), 'json');
    return data || [];
  }

  async getTransactionByDebtorId(debtorId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions
      .filter(t => t.debtorId === debtorId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async createTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transactions = await this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    transactions.push(newTx);
    await this.env.KV.put(this.getTransactionsKey(), JSON.stringify(transactions));
    return newTx;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    await this.env.KV.put(this.getTransactionsKey(), JSON.stringify(filtered));
    return true;
  }

  async getDebtorBalance(debtorId: string): Promise<number> {
    const transactions = await this.getTransactionByDebtorId(debtorId);
    return transactions.reduce((balance, tx) => {
      return tx.type === 'debt' ? balance + tx.amount : balance - tx.amount;
    }, 0);
  }
}
