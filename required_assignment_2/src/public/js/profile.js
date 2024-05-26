document.addEventListener("DOMContentLoaded", async function () {
    window.onload = function () {
        const url_params = new URLSearchParams(window.location.search);
        const personId = url_params.get("person");

        loadUserProfile(personId);
    };

    const email_table = document.querySelector("#personEmails");

    document
        .getElementById("fileUploader")
        .addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    const profile_image =
                        document.getElementById("profileImage");
                    profile_image.src = e.target.result;
                    profile_image.style.display = "block";

                    const personId = new URLSearchParams(
                        window.location.search
                    ).get("person");
                    try {
                        const response = await fetch(
                            `/api/profile/${personId}/user-photo`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    photo: e.target.result,
                                }),
                            }
                        );

                        if (!response.ok) {
                            throw new Error("Failed to update profile image");
                        }

                        console.log("Profile image updated successfully");
                    } catch (error) {
                        console.error("Error updating profile image:", error);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

    // Fetch data from the database
    async function fetchEmailTableData() {
        const personId = new URLSearchParams(window.location.search).get(
            "person"
        );
        try {
            const response = await fetch(
                `/api/profile/${personId}/person-emails`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            // Ensure the data is formatted correctly
            const formattedData = data.map((row) => [
                { id: "emailID", value: row.email_id },
                { id: "personID", value: row.person_id },
                { id: "emails", value: row.email },
            ]);

            // Get the custom-table element
            if (email_table) {
                email_table.setAttribute("data", JSON.stringify(formattedData));
                email_table.setAttribute("person-id", personId); // Added this line
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    await fetchEmailTableData();

    email_table.deleteRow = async (rowIndex) => {
        const data = JSON.parse(email_table.getAttribute("data") || "[]");
        const row = data[rowIndex];
        if (!row) return;

        const emailIdObj = row.find((item) => item.id === "emailID");
        const emailId = emailIdObj ? emailIdObj.value : undefined;

        const personId = new URLSearchParams(window.location.search).get(
            "person"
        );

        if (!emailId) {
            console.error(
                "Email ID is undefined. Cannot proceed with deletion."
            );
            return;
        }

        try {
            const response = await fetch(
                `/api/profile/${personId}/emails/${emailId}/delete`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            console.log("Email deleted successfully");
            await fetchEmailTableData(); // Refresh the table data
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation:",
                error
            );
            console.error("Error deleting email: " + error.message);
        }
    };

    document
        .getElementById("emailForm")
        .addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;

            const url_params = new URLSearchParams(window.location.search);
            const personId = url_params.get("person");

            try {
                const response = await fetch(
                    `/api/profile/${personId}/person-emails/send`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                console.log("Data Submitted Successfully:", result);

                await fetchEmailTableData();

                document.getElementById("emailForm").reset();
            } catch (error) {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            }
        });

    async function loadUserProfile(personId) {
        try {
            const response = await fetch(`/api/profile/${personId}`);
            if (!response.ok) {
                throw new Error("Failed to load user profile");
            }
            const person_data = await response.json();
            displayUserData(person_data);
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }

    function displayUserData(person_data) {
        const profile_div = document.getElementById("profileInfo");
        profile_div.innerHTML = `<strong>${person_data.name}</strong>`;

        const profile_image = document.getElementById("profileImage");
        if (person_data.photo) {
            profile_image.src = person_data.photo;
            profile_image.style.display = "block";
        } else {
            profile_image.style.display = "none";
        }
    }
});
