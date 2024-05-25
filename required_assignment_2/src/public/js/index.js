document.addEventListener("DOMContentLoaded", async () => {
    const custom_table = document.querySelector("#people-table-data");

    // Fetch data from the database
    async function fetchTableData() {
        try {
            const response = await fetch("/api");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const formattedData = data.map((person) => [
                { id: "ID", value: person.id },
                {
                    id: "Name",
                    value: person.name,
                    url: `profile?person=${person.id}`,
                },
                { id: "Sex", value: person.sex },
                { id: "Date of Birth", value: person.date_of_birth }, // Use the date string directly
                { id: "Email", value: person.email },
            ]);
            custom_table.setAttribute("data", JSON.stringify(formattedData));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    await fetchTableData();

    const form = document.getElementById("personForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const dob = document.getElementById("date").value;
        const sex =
            document.getElementById("sex").options[
                document.getElementById("sex").selectedIndex
            ].text;
        const email = document.getElementById("email").value;

        try {
            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, dob, sex, email }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("Data Submitted Successfully:", result);

            await fetchTableData();
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        }

        form.reset();
    });

    custom_table.fetchTableData = fetchTableData;
});
