import Dexie from 'dexie';

const db = new Dexie('taskStore');
db.version(1).stores({ taskList: '++id' });

export { db };
