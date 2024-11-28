function generateSeries() {
    const targetNumber = parseFloat(document.getElementById('targetNumber').value);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (isNaN(targetNumber)) {
        resultDiv.innerHTML = 'Please enter a valid number.';
        return;
    }

    let series = [];
    let currentSum = 0;
    let positiveTerm = 1;
    let negativeTerm = 2;
    let termsCount = 0;

    while (termsCount < 20) {
        if (currentSum < targetNumber) {
            currentSum += 1 / positiveTerm;
            positiveTerm += 2;
        } else {
            currentSum -= 1 / negativeTerm;
            negativeTerm += 2;
        }
        series.push(currentSum);
        termsCount++;
    }

    resultDiv.innerHTML = `<p>The first 20 partial sums of the rearranged alternating harmonic series that converges to ${targetNumber} are:</p>`;
    resultDiv.innerHTML += `<p>${series.join(', ')}</p>`;
}
