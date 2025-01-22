document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".calculate-form-wrapper");
    
    // Create a result div
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("bmi-result");
    resultDiv.style.marginTop = "18px";
    resultDiv.style.fontSize = "18px";
    resultDiv.style.fontWeight = "bold";
    resultDiv.style.color = "white";
    resultDiv.style.textAlign = "center";
    form.appendChild(resultDiv);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Get input values
        const feet = parseFloat(document.querySelector("input[placeholder='Height (ft)']").value) || 0;
        const inches = parseFloat(document.querySelector("input[placeholder='Height (in)']").value) || 0;
        const weight = parseFloat(document.querySelector("input[placeholder='Weight (lbs)']").value) || 0;
        
        // Convert height to inches
        const totalInches = feet * 12 + inches;
        
        if (totalInches === 0 || weight === 0) {
            resultDiv.textContent = "Please enter valid height and weight values.";
            return;
        }
        
        // Calculate BMI
        const bmi = (weight / (totalInches * totalInches)) * 703;
        resultDiv.textContent = `Your BMI is: ${bmi.toFixed(2)}`;
    });
});
