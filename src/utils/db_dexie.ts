import Dexie from 'dexie';

const db_dexie = new Dexie('hellodb');
db_dexie.version(1).stores({
    tranlate_log: "++id,date,tranlate_text,translate_result,translate_target"
})

export default db_dexie;