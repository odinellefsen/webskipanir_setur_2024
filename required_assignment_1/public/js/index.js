import { CustomTable } from './custom-table.js';

window.customElements.define('custom-table', CustomTable);

document.addEventListener('DOMContentLoaded', () => {
    const custom_table = document.querySelector('#people-table-data');
    const stored_data = custom_table.fetchData();
    custom_table.setAttribute('data', JSON.stringify(stored_data));

    const form = document.getElementById("personForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const user_data = [
            document.getElementById('name').value,
            document.getElementById('date').value,
            document.getElementById('sex').options[document.getElementById('sex').selectedIndex].text,
            document.getElementById('email').value
        ];

        custom_table.storeData(user_data);

        form.reset();
    });
});
