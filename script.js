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
      series.push(positiveTerm);
    } else {
      negativeTerm = getSuitableTerm(
        sequence,
        negativeTerm + 1,
        (term) => term <= 0,
      );
      term = sequence(negativeTerm);
      currentSum += term;
      series.push(negativeTerm);
    }
    partialSums.push(currentSum);
    termsCount++;
  }

  resultDiv.innerHTML = `<p>The first ${numTerms} terms of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<button class="reveal-button" onclick="toggleSeries()" id="seriesButton">Reveal Terms</button>`;
  resultDiv.innerHTML += `<p id="seriesResult" style="display:none;"></p>`;
  resultDiv.innerHTML += `<p>The corresponding first ${numTerms} partial sums of the rearranged ${getSequenceName(sequenceType)} series that converges to ${targetNumber} are:</p>`;
  resultDiv.innerHTML += `<button class="reveal-button" onclick="togglePartialSums()" id="partialSumsButton">Reveal Partial Sums</button>`;
  resultDiv.innerHTML += `<p id="partialSumsResult" style="display:none;">${partialSums.join(", ")}</p>`;

  // Render series terms using KaTeX
  const seriesResultDiv = document.getElementById("seriesResult");
  seriesResultDiv.appendChild(document.createTextNode("("));
  series.forEach((term) => {
    const termDiv = document.createElement("span");
    termDiv.innerHTML = `\\(${renderTerm(term, sequenceType)}\\)`;
    seriesResultDiv.appendChild(termDiv);
    seriesResultDiv.appendChild(document.createTextNode(", "));
  });
  // Remove the last comma
  seriesResultDiv.innerHTML = seriesResultDiv.innerHTML.slice(0, -2);
  seriesResultDiv.appendChild(document.createTextNode(")"));

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
    renderMathInElement(document.getElementById("seriesResult"));
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

// Get the first term of the sequence that satisfies the condition
// cmp(sequence(term))
function getSuitableTerm(sequence, term, cmp) {
  while (!cmp(sequence(term))) {
    term++;
  }
  return term;
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

function renderTerm(k, sequenceType) {
  const sign = (-1) ** (k + 1) < 0 ? "-" : "";
  switch (sequenceType) {
    case "harmonic":
      return `${sign}\\frac{1}{${k}}`;
    case "logarithmic":
      return `${sign}\\frac{\\log(${k})}{${k}}`;
    case "sqrt":
      return `${sign}\\frac{1}{\\sqrt{${k}}}`;
    case "sin":
      return `\\frac{\\sin(${k})}{${k}}`;
    case "alt_sin":
      return `${sign}\\frac{\\sin({${k}})}{${k}}`;
    default:
      return `${sign}\\frac{1}{${k}}`;
  }
}
