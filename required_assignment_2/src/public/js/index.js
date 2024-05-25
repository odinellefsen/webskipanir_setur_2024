document.addEventListener("DOMContentLoaded", () => {
    const custom_table = document.querySelector("#people-table-data");

    const stored_data = custom_table.fetchData();

    custom_table.setAttribute("data", JSON.stringify(stored_data));

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
                throw new Error("Network response was bad");
            }

            const result = await response.json();
            console.log(
                "Data Submitted Successfully: " + JSON.stringify(result)
            );
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
        }

        const person_data = [
            {
                id: "Name",
                value: name,
                // creating dynamic url for profile.html to create unique page for every person
                url: `profile?person=${document.getElementById("name").value}`,
            },
            {
                id: "Date of Birth",
                value: dob,
            },
            {
                id: "Sex",
                value: sex,
            },
            {
                id: "Email",
                value: email,
            },
        ];

        custom_table.storeData(person_data);

        form.reset();
    });
});
