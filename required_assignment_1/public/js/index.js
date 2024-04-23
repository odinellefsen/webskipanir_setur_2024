class CustomForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initializeTable();
    }

    static get observedAttributes() {
        return ['headers', 'data', 'caption'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.updateTableData();
        }
    }

    connectedCallback() {
        this.updateTableData();
    }

    initializeTable() {
        this.shadowRoot.innerHTML = '';

        const style = document.createElement('style');
        style.textContent = `
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px auto;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: left;
                font-size: 16px;
            }
            th {
                background-color: #f4f4f4;
            }
            tr:hover {
                background-color: #f9f9f9;
            }
            caption {
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                font-weight: bolder;
                padding: 10px;
                background-color: #cccccc;
            }
        `;
        this.shadowRoot.appendChild(style);

        const table = document.createElement('table');
        this.table = table;

        const captionText = this.getAttribute('caption');
        if (captionText) {
            const caption = document.createElement('caption');
            caption.textContent = captionText;
            table.appendChild(caption);
        }

        const headers = JSON.parse(this.getAttribute('headers') || '[]');
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        this.tbody = tbody;
        table.appendChild(tbody);

        this.shadowRoot.appendChild(table);
    }

    updateTableData() {
        const data = JSON.parse(this.getAttribute('data') || '[[]]');
        this.tbody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(row_item => {
                const td = document.createElement('td');
                td.textContent = row_item;
                tr.appendChild(td);
            })
            this.tbody.appendChild(tr);
        });
    }
}

window.customElements.define('custom-form', CustomForm);

function storeData(data) {
    const currentlyStored = fetchData();
    currentlyStored.push(data);
    localStorage.setItem('people-table-data', JSON.stringify(currentlyStored));
}

function fetchData() {
    const storedArray = localStorage.getItem('people-table-data');
    return JSON.parse(storedArray) || [];
}

document.addEventListener('DOMContentLoaded', () => {
    const allTableData = fetchData();
    const customForm = document.querySelector('#user-table');
    customForm.setAttribute('data', JSON.stringify(allTableData));

    const form = document.getElementById("personForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const userData = [
            document.getElementById('name').value,
            document.getElementById('date').value,
            document.getElementById('sex').options[document.getElementById('sex').selectedIndex].text,
            document.getElementById('email').value
        ];

        storeData(userData);

        const allTableData = fetchData();

        const customForm = document.querySelector('#user-table');
        customForm.setAttribute('data', JSON.stringify(allTableData));

        // form.reset();
    });
});
