{"changed":true,"filter":false,"title":"sendEmail.js","tooltip":"/static/js/sendEmail.js","value":"","undoManager":{"mark":-2,"position":0,"stack":[[{"start":{"row":0,"column":0},"end":{"row":15,"column":1},"action":"insert","lines":["function sendMail(contactForm) {","    emailjs.send(\"gmail\", \"rosie\", {","        \"from_name\": contactForm.name.value,","        \"from_email\": contactForm.emailaddress.value,","        \"project_request\": contactForm.projectsummary.value","    })","    .then(","        function(response) {","            console.log(\"SUCCESS\", response);","        },","        function(error) {","            console.log(\"FAILED\", error);","        }","    );","    return false;  // To block from loading a new page","}"],"id":1}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":15,"column":1},"end":{"row":15,"column":1},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1573396202252}