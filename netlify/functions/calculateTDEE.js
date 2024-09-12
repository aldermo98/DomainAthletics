// .netlify/functions/calculateTDEE.js

// Helper function to calculate TDEE
function calculateTDEE(gender, age, height_ft, height_in, weight_lbs, activityLevel) {
    // Calculate total height in inches and convert to meters
    const heightTotalInches = (height_ft * 12) + height_in;
    const heightMeters = heightTotalInches * 0.0254;
    
    // Convert weight to kg
    const weightKg = weight_lbs * 0.453592;
    
    // Calculate BMI
    const bmi = weightKg / (heightMeters * heightMeters);
    
    const isMale = gender === "Male";

    const activityMultipliers = {
        'Sedentary (Office job)': 1.2,
        'Light Exercise (1-2 times/week)': 1.375,
        'Moderate Exercise (2-3 times/week)': 1.55,
        'Heavy Exercise (3-5 times/week)': 1.725,
        'Athlete (2 times/day)': 1.9
    };

    // Calculate BMR and TDEE
    const bmr = 10 * weightKg + 6.25 * (heightMeters * 100) - 5 * age + (isMale ? 5 : -161);
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2); // Default to sedentary if no match
    return { bmi, tdee };
}

exports.handler = async (req, context) => {
    try {
        const data = JSON.parse(req.body);
        const { gender, age, weight_lbs, height_ft, height_in, activityLevel, contactId } = data;

        const calculatedValues = calculateTDEE(gender, age, height_ft, height_in, weight_lbs, activityLevel);

        // Dynamically import node-fetch
        const fetch = await import('node-fetch').then(mod => mod.default);

        // Update HighLevel contact with the TDEE value
        const highLevelApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImhNTmRCOWo2RzFwT2pPOGlQTFNQIiwidmVyc2lvbiI6MSwiaWF0IjoxNzI2MDg0ODExMDE1LCJzdWIiOiJ5UE1ENFUwR1dnMUhwMkJhTTQ5RiJ9.oYMwCZ2pZ4LkgDvM278wJFMStA8H1-q9JvmOfZSfN-A'; // Replace with your actual HighLevel API key
        const highLevelUpdateUrl = `https://rest.gohighlevel.com/v1/contacts/${contactId}`;

        const response = await fetch(highLevelUpdateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${highLevelApiKey}`
            },
            body: JSON.stringify({
                customField: {
                    bmi: calculatedValues.bmi,
                    tdee: calculatedValues.tdee
                }
            })
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to update contact in HighLevel' })
            };
        }

        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'TDEE calculated and updated successfully', tdee: calculatedValues.tdee })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
