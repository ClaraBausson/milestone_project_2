function sendMail(contactForm) {
    emailjs.send("gmail", "feature_request", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "feature_request": contactForm.featuresummary.value
    })
    .then(
        function(response) {
            console.log("SUCCESS", response); // To add: Success message here
        },
        function(error) {
            console.log("FAILED", error); // To add: Fail message here
        }
    );
    return false;  // To block from loading a new page
}