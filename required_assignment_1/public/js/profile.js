window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = decodeURIComponent(urlParams.get('user')); // Decodes the parameter
    document.getElementById('profileInfo').innerHTML = `Profile of <strong>${user}</strong>`;
    // AJAX calls can be made here to fetch more data
};