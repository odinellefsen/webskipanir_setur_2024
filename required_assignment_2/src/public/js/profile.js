window.onload = function () {
    const url_params = new URLSearchParams(window.location.search);
    // decoding spaces and special characters after 'user=' in url
    const user = decodeURIComponent(url_params.get("user"));

    loadUserProfile(user);
};

document.getElementById("fileUploader").addEventListener("change", (event) => {
    // file at index 0
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profile_image = document.getElementById("profileImage");
            profile_image.src = e.target.result;
            profile_image.style.display = "block";

            // storing the image as Base64 in localStorage
            const user = new URLSearchParams(window.location.search).get(
                "user"
            );
            const user_data = localStorage.getItem(user);
            if (user_data) {
                const user_data_obj = JSON.parse(user_data);
                user_data_obj.photo = e.target.result;
                localStorage.setItem(user, JSON.stringify(user_data_obj));
            }
        };
        reader.readAsDataURL(file);
    }
});

function loadUserProfile(user) {
    let user_data = localStorage.getItem(user);

    // if no user data is found then I create a basic layout
    if (!user_data) {
        user_data = JSON.stringify({
            name: user,
            photo: "",
        });
        localStorage.setItem(user, user_data);
    }

    displayUserData(JSON.parse(user_data));
}

function displayUserData(user_data) {
    const profile_div = document.getElementById("profileInfo");
    profile_div.innerHTML = `<strong>${user_data.name}</strong>`;

    // populating profileImage with the actual image
    const profile_image = document.getElementById("profileImage");
    if (user_data.photo) {
        profile_image.src = user_data.photo;
        profile_image.style.display = "block";
    }
}
