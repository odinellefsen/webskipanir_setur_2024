import { CustomForm } from './custom-form.js';

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

        form.reset();
    });
});
