export class CustomTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.initializeTable();
    }

    static get observedAttributes() {
        return ['headers', 'data', 'caption'];
    }

    attributeChangedCallback(name) {
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

        const caption_text = this.getAttribute('caption');
        if (caption_text) {
            const caption = document.createElement('caption');
            caption.textContent = caption_text;
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

    fetchData() {
        const stored_data = localStorage.getItem(this.id);
        return stored_data ? JSON.parse(stored_data) : [];
    }    

    storeData(newData) {
        const currentlyStoredData = this.fetchData();
        currentlyStoredData.push(newData);
        localStorage.setItem(this.id, JSON.stringify(currentlyStoredData));
    }    

    deleteRow(index) {
        const currentlyStored = this.fetchData();
        currentlyStored.splice(index, 1);
        this.storeData(currentlyStored);
    }
}