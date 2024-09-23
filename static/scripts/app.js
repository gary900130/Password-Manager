import fetchData from './fetchData.js';
import PasswordManager from './editData.js';

fetchData.init();
setTimeout(PasswordManager.init(), 1000);