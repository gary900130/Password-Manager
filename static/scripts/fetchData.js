const fetchData = {
    fetchAndProcessInfo(code) {
        fetch('./static/scripts/passwords.json')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const matchingItem = data.find(item => item.code === code); // 查找 code 值相同的項目
                    if (matchingItem) {
                        this.updateInfoBlock(matchingItem); // 更新信息區塊
                    } else {
                        throw new Error('No matching item found');
                    }
                } else {
                    throw new Error('Fetched data is not in the expected format');
                }
            })
            .catch(error => {
                console.error('Error loading or processing data:', error);
                this.updateInfoBlock([]);
            });
    },

    fetchAndProcessData() {
        fetch('./static/scripts/passwords.json')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    localStorage.setItem('appData', JSON.stringify(data));
                    this.updatePasswordList(data);
                } else {
                    throw new Error('Fetched data is not in the expected format');
                }
            })
            .catch(error => {
                console.error('Error loading or processing data:', error);
                this.updatePasswordList([]);
            });
    },

    updatePasswordList(passwords) {
        if (!Array.isArray(passwords)) {
            console.error('Expected passwords to be an array, got:', passwords);
            passwords = [];
        }

        const passwordList = document.querySelector('.passwordList');
        passwordList.innerHTML = '';

        passwords.forEach(item => {
            const li = document.createElement('li');
            const iconUrl = `https://icons.duckduckgo.com/ip2/${item.site}.ico`;

            li.innerHTML = `
                <button class="passwordItem" code=${item.code}>
                    <img id="logo" src="${iconUrl}" alt="" onerror="this.src='./images/eye-icon.svg';">
                    <div class="passwordTag">
                        <span class="tag">
                            <p id="title" class="title">${item.title || 'N/A'}</p>
                        </span>
                        <span class="tag">
                            <p id="site" class="site">${item.site || 'N/A'}</p>
                        </span>
                    </div>
                </button>
            `;
            passwordList.appendChild(li);
        });

        // 重新添加事件監聽器
        this.addPasswordItemListeners();
    },

    updateInfoBlock(item) {
        const elements = {
            title: document.querySelector('#infoTitle'),
            account: document.querySelector('#account'),
            password: document.querySelector('#password'),
            site: document.querySelector('#infoSite'),
            note: document.querySelector('#note')
        };
    
        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                element.value = item[key] || '';
                element.setAttribute('code', item['code'])
            } else {
                console.warn(`Element with id '${key}' not found`);
            }
        }
    },

    searchPasswords(searchTerm) {
        const data = JSON.parse(localStorage.getItem('appData'));
        if (!Array.isArray(data)) {
            console.error('No valid data found in localStorage');
            return;
        }

        const filteredPasswords = data.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.site.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.updatePasswordList(filteredPasswords);
    },

    addPasswordItemListeners() {
        document.querySelectorAll('.passwordItem').forEach(button => {
            button.addEventListener('click', () => {
                const code = button.getAttribute('code');
                this.fetchAndProcessInfo(code);
                document.getElementById('confirmButton').style.display = "flex";
                document.getElementById('deleteButton').style.display = "flex";
            });
        });
    },

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.fetchAndProcessData();
            
            // 添加搜索功能
            const searchButton = document.getElementById('searchButton');
            const searchBar = document.getElementById('searchBar');
            
            searchButton.addEventListener('click', () => {
                const searchTerm = searchBar.value;
                this.searchPasswords(searchTerm);
            });

            // 為搜索欄添加回車鍵事件
            searchBar.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    const searchTerm = searchBar.value;
                    this.searchPasswords(searchTerm);
                }
            });
        });
    }
};

export default fetchData;