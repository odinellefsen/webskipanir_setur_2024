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
        const headers = JSON.parse(this.getAttribute('headers') || '[]');
        this.tbody.innerHTML = '';

        // rendering based on order and values of the headers attribute values
        // basically the order of values in data is rearranged to be exact same order as headers
        // and all values in data that are not in headers will be removed
        function reorderedData(data, headers) {
            let new_array = []
            let current_arr = [];
            headers.map(header => {
                let is_value_found = false;
                for (let arr of data) {
                    for(let object = 0; object < arr.length; object++) {
                        if (arr[object].id == header) {
                            is_value_found = true;
                            current_arr = arr[object].value;
                            break;
                        }
                    }
                    if (is_value_found) break;
                }
                new_array.push(is_value_found ? current_arr : "");
            })
            return new_array;
        }

        const ordered_data = reorderedData(data, headers);
        console.log('ordered data: ', ordered_data);

        const tr = document.createElement('tr');
        ordered_data.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);

        })
        this.tbody.appendChild(tr);
    }

    fetchData() {
        const stored_data = localStorage.getItem(this.id);
        return stored_data ? JSON.parse(stored_data) : [];
    }    

    storeData(newData) {
        const currently_stored_data = this.fetchData();
        currently_stored_data.push(newData);
        const new_data_string = JSON.stringify(currently_stored_data);
        if (this.getAttribute('data') !== new_data_string) {
            localStorage.setItem(this.id, new_data_string);
            this.setAttribute('data', new_data_string);
        }
    }    

    deleteRow(index) {
        const data = this.fetchData();
        data.splice(index, 1);
        this.storeData(data);
    }
}