function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(samplesObj => samplesObj.id == sample);
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];
    var metadataResult = metadataArray[0];
    console.log(samplesResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = samplesResult.otu_ids.map(samp => String(`OTU ${samp}`));
    var otu_ids = samplesResult.otu_ids;
    var otu_labels = samplesResult.otu_labels;
    var sample_values = samplesResult.sample_values;
    var wfreq = parseFloat(metadataResult.wfreq);
    console.log("otu_ids", otu_ids);
    console.log(otu_labels);
    console.log(sample_values);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks = otu_ids.slice(0,10).reverse();
    var yticks = otu_ids.map(samp => String(`OTU ${samp}`)).slice(0,10).reverse();
    var sliced_values = sample_values.slice(0,10).reverse();
    var sliced_labels = otu_labels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sliced_values,
      y: yticks,
      hovertext: sliced_labels,
      type: "bar",
      orientation: 'h'
    };

    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

      // 1. Create the trace for the bubble chart.

    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Electric'
      }
    };

    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID"},
      hoverlabel: otu_labels
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    var gaugeTrace = {
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week<br>"},
      gauge: {
        bar: { color: "black" },
        axis: { range: [null, 10] },
        steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "green" }
        ]
      }
      };
    
      var gaugeData = [gaugeTrace];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

// Bar and Bubble charts
// // Create the buildCharts function.
// function buildCharts(sample) {
//   // Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
    

//     // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
//     //Plotly.newPlot(); 

//     // 1. Create the trace for the bubble chart.

//     var trace = {
//       x: sample_values,
//       y: yticks,
//       text: otu_labels,
//       mode: 'markers',
//       marker: {
//         size: [40, 60, 80, 100],
//         color: red,
//         colorscale: Blues,
//       }
//     };

//     var bubbleData = [trace];

//     // 2. Create the layout for the bubble chart.
//     var bubbleLayout = {
//       title: "Bacteria Cultures Per Sample",
//       xaxis: { title: "OTU ID"}
//     };

//     // 3. Use Plotly to plot the data with the layout.
//     Plotly.newPlot("scatter", bubbleData, bubbleLayout); 
//   });
// }
