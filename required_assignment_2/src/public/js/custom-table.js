// creating a web component by extending HTMLElement
export class CustomTable extends HTMLElement {
    constructor() {
        super();
        // creating a shadow dom
        this.attachShadow({ mode: "open" });

        this.initializeTable();
    }

    static get observedAttributes() {
        return ["headers", "data", "caption"];
    }

    // this gets called when an attribute changes
    attributeChangedCallback(name) {
        // if data in data attribute changes then the table is updated
        if (name === "data") {
            this.updateTableData();
        }
    }

    // when CustomTable is placed as an html element in the DOM this is activated
    connectedCallback() {
        this.updateTableData();
    }

    // initializing basic table structure when instance of CustomTable is created
    initializeTable() {
        this.shadowRoot.innerHTML = "";

        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
        this.shadowRoot.appendChild(styleLink);

        const style = document.createElement("style");
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

        const table = document.createElement("table");
        this.table = table;

        const caption_text = this.getAttribute("caption");
        if (caption_text) {
            const caption = document.createElement("caption");
            caption.textContent = caption_text;
            table.appendChild(caption);
        }

        // fetching values of CustomTable headers attribute
        const headers = JSON.parse(this.getAttribute("headers") || "[]");
        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");

        headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header;
            trHead.appendChild(th);
        });
        const delete_row_th = document.createElement("th");
        delete_row_th.textContent = "Delete a Row";
        trHead.appendChild(delete_row_th);
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        this.tbody = tbody;
        table.appendChild(tbody);

        // appending an instances' table to the shadow dom
        this.shadowRoot.appendChild(table);
    }

    updateTableData() {
        const data = JSON.parse(this.getAttribute("data") || "[[]]");
        const headers = JSON.parse(this.getAttribute("headers") || "[]");
        this.tbody.innerHTML = "";

        // rendering based on order and values of the headers attribute values
        // basically the order of values in data is rearranged to be exact same order as headers
        // and all values in data that are not in headers will be removed
        function reorderedData(data, headers) {
            let new_data_array = [];
            data.forEach((arr) => {
                let reordered = [];
                headers.forEach((header) => {
                    let found_object = arr.find(
                        (object) =>
                            object.id.toLowerCase() === header.toLowerCase()
                    );
                    if (found_object) {
                        reordered.push(found_object);
                    }
                });
                new_data_array.push(reordered);
            });

            return new_data_array;
        }

        // basically by default the array has an empty array so I do a small check for that
        if (data.length > 0 && data[0].length != 0) {
            const ordered_data = reorderedData(data, headers);

            ordered_data.forEach((row, rowIndex) => {
                const tr = document.createElement("tr");
                row.forEach((object) => {
                    const td = document.createElement("td");
                    if (object.hasOwnProperty("url")) {
                        const a_link = document.createElement("a");
                        a_link.href = object.url;
                        a_link.innerHTML = object.value;
                        td.appendChild(a_link);
                    } else {
                        td.textContent = object.value;
                    }
                    tr.appendChild(td);
                });
                const delete_row = document.createElement("td");
                delete_row.style =
                    "text-align: center; vertical-align: middle;";

                const delete_row_icon = document.createElement("i");
                delete_row_icon.className = "fa-solid fa-x";
                delete_row_icon.style =
                    "cursor: pointer; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #dc2626;";
                delete_row_icon.addEventListener("click", () =>
                    this.deleteRow(rowIndex)
                );

                delete_row.appendChild(delete_row_icon);

                tr.appendChild(delete_row);
                this.tbody.appendChild(tr);
            });
        }
    }

    async deleteRow(rowIndex) {
        const data = JSON.parse(this.getAttribute("data") || "[]");
        const row = data[rowIndex];
        if (!row) return;

        const id = row.find((obj) => obj.id === "ID").value;

        try {
            const response = await fetch(`/api/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            await this.closest("html")
                .querySelector("#people-table-data")
                .fetchTableData(); // Refresh table data
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        }
    }
}

window.customElements.define("custom-table", CustomTable);
