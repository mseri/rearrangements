let seriesChart;

function generateSeries() {
  const targetNumber = parseFloat(
    document.getElementById("targetNumber").value,
  );
  const numTerms = parseInt(document.getElementById("numTerms").value);
  const sequenceType = document.getElementById("sequenceType").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // Clear previous results

  if (isNaN(targetNumber) || isNaN(numTerms)) {
    resultDiv.innerHTML = "Please enter valid numbers.";
    return;
  }

  let series = [];
  let partialSums = [];
  let currentSum = 0;
  let positiveTerm = 1;
  let negativeTerm = 2;
  let term = 0;
  let termsCount = 0;

  let sequence = getSequence(sequenceType);

  while (termsCount < numTerms) {
    if (currentSum < targetNumber) {
      term = sequence(positiveTerm);
      currentSum += term;
      positiveTerm += 2;
    } else {
      term = sequence(negativeTerm);
      currentSum += term;
      negativeTerm += 2;
    }
    partialSums.push(currentSum);
    series.push(term);
    termsCount++;
  }

  resultDiv.innerHTML = `<p>The first ${numTerms} terms of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<p>${series.join(", ")}</p>`;
  resultDiv.innerHTML += `<p>The corresponding first ${numTerms} partial sums of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<p>${partialSums.join(", ")}</p>`;

  // Destroy the existing chart if it exists
  if (seriesChart) {
    seriesChart.destroy();
  }

  // Plot the series
  const ctx = document.getElementById("seriesChart").getContext("2d");
  seriesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: partialSums.map((_, index) => index + 1),
      datasets: [
        {
          label: "Partial Sums",
          data: partialSums,
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

function getSequence(sequenceType) {
  switch (sequenceType) {
    case "harmonic":
      return (k) => (-1) ** (k + 1) / k;
    case "logarithmic":
      return (k) => ((-1) ** (k + 1) * Math.log(k)) / k;
    case "sqrt":
      return (k) => (-1) ** (k + 1) / Math.sqrt(k);
    default:
      return (k) => (-1) ** (k + 1) / k;
  }
}

function getSequenceName(sequenceType) {
  switch (sequenceType) {
    case "harmonic":
      return "alternating harmonic";
    case "logarithmic":
      return "alternating logarithmic";
    case "sqrt":
      return "alternating square root";
    default:
      return "alternating harmonic";
  }
}
