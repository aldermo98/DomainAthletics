(()=>{
    document.querySelector('.calculate-form-wrapper').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
    
        // Get the form values
        const heightFt = parseFloat(document.querySelector('input[name="height-ft"]').value) || 0;
        const heightIn = parseFloat(document.querySelector('input[name="height-in"]').value) || 0;
        const weightLbs = parseFloat(document.querySelector('input[name="weight-lbs"]').value) || 0;
        const gender = document.querySelector('select[name="gender"]').value;
        const age = parseInt(document.querySelector('input[name="age"]').value);
    
        // Calculate BMI
        const heightTotalInches = (heightFt * 12) + heightIn;
        const heightMeters = heightTotalInches * 0.0254;
        const weightKg = weightLbs * 0.453592;
        const bmi = weightKg / (heightMeters * heightMeters);
    
        // Function to set a cookie
        function setCookie(name, value, days, domain) {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
        }
    
        setCookie("visitor_bmi", bmi.toFixed(2), 7, ".varwebsolutions.com");
        alert(bmi)
    
        // Redirect to the landing page
        window.location.href = 'https://gymfunnel.varwebsolutions.com/home374390';
    });    
})();