let seriesChart;

function generateSeries() {
  const targetNumber = parseFloat(
    document.getElementById("targetNumber").value,
  );
  const numTerms = parseInt(document.getElementById("numTerms").value);
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear previous results

  if (isNaN(targetNumber) || isNaN(numTerms)) {
    resultDiv.innerHTML = "Please enter valid numbers.";
    return;
  }

  let series = [];
  let currentSum = 0;
  let positiveTerm = 1;
  let negativeTerm = 2;
  let termsCount = 0;

  while (termsCount < numTerms) {
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

  resultDiv.innerHTML = `<p>The first ${numTerms} partial sums of the rearranged alternating harmonic series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<p>${series.join(", ")}</p>`;

  // Destroy the existing chart if it exists
  if (seriesChart) {
    seriesChart.destroy();
  }

  // Plot the series
  const ctx = document.getElementById("seriesChart").getContext("2d");
  seriesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: series.map((_, index) => index + 1),
      datasets: [
        {
          label: "Partial Sums",
          data: series,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Target Value",
          data: Array(numTerms).fill(targetNumber),
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Term Number",
          },
        },
        y: {
          title: {
            display: true,
            text: "Partial Sum",
          },
        },
      },
    },
  });
}
