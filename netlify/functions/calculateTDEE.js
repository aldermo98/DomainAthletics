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
    return { bmi: bmi, tdee: tdee };
}

exports.handler = async (req, context) => {
    try {
        const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { gender, age, weight_lbs, height_ft, height_in, activityLevel, contactId } = data.customData;

        const calculatedValues = calculateTDEE(gender, parseInt(age), parseInt(height_ft), parseInt(height_in), parseFloat(weight_lbs), activityLevel);

        // Dynamically import node-fetch
        const fetch = await import('node-fetch').then(mod => mod.default);

        // Update HighLevel contact with the TDEE value
        const highLevelApiKey = process.env.HIGHLEVEL_API_KEY; // Replace with your actual HighLevel API key
        const highLevelUpdateUrl = `https://services.leadconnectorhq.com/contacts/${contactId}`;

        const response = await fetch(highLevelUpdateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${highLevelApiKey}`,
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                customFields: [
                    {
                        id: "cwcN41At0c69w6ThqNVt",
                        value: calculatedValues.bmi
                    },{
                        id: "ScThEg1uIelu6oZHkjPm",
                        value: calculatedValues.tdee
                    }
                ]
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
