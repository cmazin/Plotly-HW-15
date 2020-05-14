function buildMetadata(sample) {

  const metadataURL = `/metadata/${sample}`;
  d3.json(metadataURL).then((data) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    Object.entries(data).forEach(([key, value]) => {
      sample_metadata.append("p").text(`${key}: ${value}`);
    });

  });

}

function buildCharts(sample) {

  // @TODO: fetch the sample data for the plots
  const sampleDataURL = `/samples/${sample}`;
  d3.json(sampleDataURL).then((data) => {
    results = [];
    for (var i = 0; i < data.otu_ids.length; i++) {
      results.push({ "otu_ids": data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values": data.sample_values[i] });
    };
  
    results.sort((a, b) => b.sample_values - a.sample_values);
    results = results.slice(0, 10);
    console.log(results);

    // @TODO: Bubble Chart sample data
    var trace1 = {
      values: results.map(row => row.sample_values),
      labels: results.map(row => row.otu_ids),
      hovertext: results.map(row => row.otu_labels),
      hoverinfo: "hovertext",
      type: "pie"
    };
    var pieChart = [trace1];
    Plotly.newPlot("pie", pieChart);

    // @TODO: Pie Chart sample data
    var trace2 = {
      x: data.otu_ids,
      y: data.sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    var bubbleChart = [trace2];
    Plotly.newPlot("bubble", bubbleChart);
  })
}

function init() {
  // reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // list of sample names populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
