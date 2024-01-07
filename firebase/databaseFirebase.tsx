import firebase from 'firebase/app';
import { getDatabase, get, ref } from 'firebase/database';
import 'firebase/auth';
import app from './appFirebase';

const database = getDatabase(app);

const dbRef_all = ref(database);

const dbRef_users = ref(database, 'data/users');

export default dbRef_users;
