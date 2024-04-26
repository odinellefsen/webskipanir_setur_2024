import { CustomTable } from './custom-table.js';

// initializing a custom html element called custom-table that uses CustomTable class
window.customElements.define('custom-table', CustomTable);

// waiting for everything to load
document.addEventListener('DOMContentLoaded', () => {
    // targeting html element with id people-table-data
    const custom_table = document.querySelector('#people-table-data');
    // fetching any stored table information from local storage
    const stored_data = custom_table.fetchData();
    // setting data attribute of custom_table to stored data
    custom_table.setAttribute('data', JSON.stringify(stored_data));

    // targeting html element with id personForm
    const form = document.getElementById("personForm");
    // waiting for form to be submitted
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const user_data = [
            {
                id: 'Name',
                value: document.getElementById('name').value,
                // creating dynamic url for profile.html to create unique page for every person
                url: `profile.html?user=${document.getElementById('name').value}`
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
