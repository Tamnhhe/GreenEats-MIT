function calculateScore() {
    const foodType = document.getElementById('foodType').value;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const resultDiv = document.getElementById('result');

    // Simple sustainability scoring logic (customizable)
    let baseScore;
    if (foodType === 'vegetable') baseScore = 9;
    else if (foodType === 'grain') baseScore = 7;
    else if (foodType === 'meat') baseScore = 3;

    const distancePenalty = Math.min(distance / 100, 5); // Max penalty of 5
    const finalScore = Math.max(baseScore - distancePenalty, 0) * quantity;

    if (distance && quantity) {
        resultDiv.innerHTML = `Sustainability Score: ${finalScore.toFixed(1)}/10<br>Based on ${quantity}kg of ${foodType}.`;
    } else {
        resultDiv.innerHTML = 'Please enter valid distance and quantity.';
    }
}