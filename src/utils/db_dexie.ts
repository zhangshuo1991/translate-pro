import Dexie from 'dexie';

const db_dexie = new Dexie('hellodb');
db_dexie.version(1).stores({
    tranlate_log: "++id,date,tranlate_text,translate_result,translate_target"
})

db_dexie.version(2).stores({
    layout_config: "++id,date,layout_config"
})
export default db_dexie;