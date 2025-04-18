document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
});

document.querySelector(".menu-toggle").addEventListener("click", function() {
    document.querySelector("nav ul").classList.toggle("active");
});