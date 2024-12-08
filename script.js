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
  let positiveTerm = 0;
  let negativeTerm = 0;
  let term = 0;
  let termsCount = 0;

  let sequence = getSequence(sequenceType);

  while (termsCount < numTerms) {
    if (currentSum < targetNumber) {
      positiveTerm = getSuitableTerm(
        sequence,
        positiveTerm + 1,
        (term) => term >= 0,
      );
      term = sequence(positiveTerm);
      currentSum += term;
    } else {
      negativeTerm = getSuitableTerm(
        sequence,
        negativeTerm + 1,
        (term) => term <= 0,
      );
      term = sequence(negativeTerm);
      currentSum += term;
    }
    partialSums.push(currentSum);
    series.push(term);
    termsCount++;
  }

  resultDiv.innerHTML = `<p>The first ${numTerms} terms of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<button class="reveal-button" onclick="toggleSeries()" id="seriesButton">Reveal Terms</button>`;
  resultDiv.innerHTML += `<p id="seriesResult" style="display:none;">${series.join(", ")}</p>`;
  resultDiv.innerHTML += `<p>The corresponding first ${numTerms} partial sums of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<button class="reveal-button" onclick="togglePartialSums()" id="partialSumsButton">Reveal Partial Sums</button>`;
  resultDiv.innerHTML += `<p id="partialSumsResult" style="display:none;">${partialSums.join(", ")}</p>`;

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

function toggleSeries() {
  const seriesResult = document.getElementById("seriesResult");
  const seriesButton = document.getElementById("seriesButton");
  if (seriesResult.style.display === "none") {
    seriesResult.style.display = "block";
    seriesButton.textContent = "Hide Terms";
  } else {
    seriesResult.style.display = "none";
    seriesButton.textContent = "Reveal Terms";
  }
}

function togglePartialSums() {
  const partialSumsResult = document.getElementById("partialSumsResult");
  const partialSumsButton = document.getElementById("partialSumsButton");
  if (partialSumsResult.style.display === "none") {
    partialSumsResult.style.display = "block";
    partialSumsButton.textContent = "Hide Partial Sums";
  } else {
    partialSumsResult.style.display = "none";
    partialSumsButton.textContent = "Reveal Partial Sums";
  }
}

function getSequence(sequenceType) {
  switch (sequenceType) {
    case "harmonic":
      return (k) => (-1) ** (k + 1) / k;
    case "logarithmic":
      return (k) => ((-1) ** (k + 1) * Math.log(k)) / k;
    case "sqrt":
      return (k) => (-1) ** (k + 1) / Math.sqrt(k);
    case "sin":
      return (k) => Math.sin(k) / k;
    case "alt_sin":
      return (k) => ((-1) ** (k + 1) * Math.sin(k)) / k;
    default:
      return (k) => (-1) ** (k + 1) / k;
  }
}

// Get the first term of the sequence that satisfies the condition
// cmp(sequence(term))
function getSuitableTerm(sequence, term, cmp) {
  while (!cmp(sequence(term))) {
    term++;
  }
  return term;
}

function getSequenceName(sequenceType) {
  switch (sequenceType) {
    case "harmonic":
      return "alternating harmonic";
    case "logarithmic":
      return "alternating logarithmic";
    case "sqrt":
      return "alternating square root";
    case "sin":
      return "sin(n)/n";
    case "alt_sin":
      return "alternating sin(n)/n";
    default:
      return "alternating harmonic";
  }
}
