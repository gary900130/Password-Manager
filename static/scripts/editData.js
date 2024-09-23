// editData.js
import fetchData from './fetchData.js';  // 確保正確導入 fetchData

const PasswordManager = {
    constructor() {
        this.confirmButton = document.getElementById('confirmButton');
        this.addButton = document.getElementById('addButton');
        this.deleteButton = document.getElementById('deleteButton');
    },

    clearInputFields() {
        ['infoTitle', 'account', 'password', 'infoSite', 'note'].forEach(id => {
            document.getElementById(id).value = '';
        });
    },

    async addInfo() {
        const url = `/add`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response;
    },

    async updateInfo(code) {
        const updateData = {
            "code": code,
            "title": document.getElementById('infoTitle').value,
            "account": document.getElementById('account').value,
            "password": document.getElementById('password').value,
            "site": document.getElementById('infoSite').value,
            "note": document.getElementById('note').value
        }
        const url = `/update/${code}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        return response;
    },

    async deleteInfo(code) {
        const url = `/delete/${code}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    init() {
        document.getElementById('confirmButton').addEventListener('click', async () => {
            const code = document.getElementById('infoTitle').getAttribute('code');
            try {
                const response = await this.updateInfo(code);
                if (response.ok) {
                    this.clearInputFields();
                    document.getElementById('confirmButton').style.display = "none";
                    document.getElementById('deleteButton').style.display = "none";
                    // 重新讀取並刷新 passwordList
                    fetchData.fetchAndProcessData();
                } else {
                    console.error('Error updating info:', await response.text());
                }
            } catch (error) {
                console.error('Error updating info:', error);
            }
        });

        document.getElementById('deleteButton').addEventListener('click', async () => {
            const code = document.getElementById('infoTitle').getAttribute('code');
            try {
                const response = await this.deleteInfo(code);
                if (response.ok) {
                    this.clearInputFields();
                    document.getElementById('confirmButton').style.display = "none";
                    document.getElementById('deleteButton').style.display = "none";
                    // 重新讀取並刷新 passwordList
                    fetchData.fetchAndProcessData();
                } else {
                    console.error('Error deleting info:', await response.text());
                }
            } catch (error) {
                console.error('Error deleting info:', error);
            }
        });

        document.getElementById('addButton').addEventListener('click', async () => {
            try {
                const response = await this.addInfo();
                if (response.ok) {
                    // 重新讀取並刷新 passwordList
                    fetchData.fetchAndProcessData();
                } else {
                    console.error('Error deleting info:', await response.text());
                }
            } catch (error) {
                console.error('Error deleting info:', error);
            }
        });

        document.getElementById('searchButton').addEventListener('click', () => {
            const tag = document.getElementById('searchBar').value;
            console.log(tag);
        });
    },
};

export default PasswordManager;