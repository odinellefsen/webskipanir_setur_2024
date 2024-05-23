window.onload = function () {
    const url_params = new URLSearchParams(window.location.search);
    // decoding spaces and special characters after 'person=' in url
    const person = decodeURIComponent(url_params.get("person"));

    loadUserProfile(person);
};

document.getElementById("fileUploader").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profile_image = document.getElementById("profileImage");
            profile_image.src = e.target.result;
            profile_image.style.display = "block";

            // storing the image as Base64 in localStorage
            const person = new URLSearchParams(window.location.search).get(
                "person"
            );
            const person_data = localStorage.getItem(person);
            if (person_data) {
                const user_data_obj = JSON.parse(person_data);
                user_data_obj.photo = e.target.result;
                localStorage.setItem(person, JSON.stringify(user_data_obj));
            }
        };
        reader.readAsDataURL(file);
    }
});

function loadUserProfile(person) {
    let person_data = localStorage.getItem(person);

    // if no person data is found then I create a basic layout
    if (!person_data) {
        person_data = JSON.stringify({
            name: person,
            photo: "",
        });
        localStorage.setItem(person, person_data);
    }

    displayUserData(JSON.parse(person_data));
}

function displayUserData(person_data) {
    const profile_div = document.getElementById("profileInfo");
    profile_div.innerHTML = `<strong>${person_data.name}</strong>`;

    // populating profileImage with the actual image
    const profile_image = document.getElementById("profileImage");
    if (person_data.photo) {
        profile_image.src = person_data.photo;
        profile_image.style.display = "block";
    }
}
