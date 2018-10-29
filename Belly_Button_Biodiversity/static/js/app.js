function buildMetadata(sample) {


    d3.json("/metadata" + "/" + sample).then((samples) =>{
        console.log(samples);
        d3.select("#sample-metadata").selectAll('p').remove()
        d3.select("#sample-metadata")
            .selectAll('p')
            .data(d3.entries(samples))
            .enter()
            .append('p')
    		.append("text")
    		.text(d=> `${d.key} : ${d.value}`)

        buildGauge(samples.WFREQ);
    })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json("/samples" + "/" + sample).then((samples) =>{
        console.log(samples);
        buildPieChart(samples);
        buildBubbleChart(samples);
    })

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function buildPieChart(samples){
    let data = [{
      values: samples.sample_values.slice(0, 10),
      labels: samples.otu_ids.slice(0, 10),
      type: 'pie',
      hovertext: samples.otu_labels.slice(0, 10)
    }];

    let layout = {
        title: 'Pie Chart',
        height: 'max-content',
        width: 'max-content'
    };
    Plotly.newPlot('pie', data, layout);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function buildBubbleChart(samples){
    let trace1 = {
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: 'markers',
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids,
        colorscale: "Earth"
    },
      text:samples.otu_labels
    };

    let data = [trace1];

    let layout = {
      title: 'Bubble Chart',
      showlegend: false,
      height: 600,
      width: 1200,
    };

    Plotly.newPlot('bubble', data, layout);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function buildGauge(WFREQ)
{
    // Enter a speed between 0 and 180
    console.log(WFREQ)
    var level = WFREQ;

    // Trig to calc meter point
    var degrees = 10 - level,
         radius = .5;
    var radians = degrees * Math.PI / 10;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6',
                '4-5', '3-4', '2-3', '1-2', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(4, 4, 4, .5)', 'rgba(3, 19, 1, .5)', 'rgba(8, 70, 1, .5)',
                             'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                             'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                             'rgba(255, 255, 255, 0)']},
      labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', '1-9', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Washing Frequency',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // d3.json("/samples" + "/" + newSample).then((samples) =>{
  //     console.log(samples)})
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
