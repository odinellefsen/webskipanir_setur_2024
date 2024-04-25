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
            {
                id: 'Name',
                value: document.getElementById('name').value,
                url: `profile.html?user=${document.getElementById('name').value.toLowerCase()}`
            },
            {
                id: 'Date of Birth',
                value: document.getElementById('date').value
            },
            {
                id: 'Sex',
                value: document.getElementById('sex').options[document.getElementById('sex').selectedIndex].text
            },
            {
                id: 'Email',
                value: document.getElementById('email').value
            }
        ];        

        custom_table.storeData(user_data);

        form.reset();
    });
});
