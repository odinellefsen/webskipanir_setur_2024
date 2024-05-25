window.onload = function () {
    const url_params = new URLSearchParams(window.location.search);
    const personId = url_params.get("person");

    loadUserProfile(personId);
};

document.getElementById("fileUploader").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const profile_image = document.getElementById("profileImage");
            profile_image.src = e.target.result;
            profile_image.style.display = "block";

            const personId = new URLSearchParams(window.location.search).get(
                "person"
            );
            try {
                const response = await fetch(`/api/profile/${personId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ photo: e.target.result }),
                });

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
