const express = require('express');
const app = express();
const googleTrends = require('google-trends-api');

// Define a route to retrieve the chart data
app.get('/chart-data', (req, res) => {
  googleTrends
    .interestOverTime({
      keyword: "Cars",
      startTime: new Date("2020-01-01"),
    })
    .then(function (results) {
      console.log('Results:', results);

      if (!results.default || !results.default.timelineData) {
        throw new Error('Invalid data format');
      }

      // Get the interest over time data
      var interestOverTimeData = results.default.timelineData.map(function (
        data
      ) {
        return data.value[0];
      });

      // Get the dates
      var dates = results.default.timelineData.map(function (data) {
        return new Date(data.time);
      });

      // Create the chart data
      var chartData = {
        labels: dates,
        datasets: [
          {
            label: 'Interest over time for "Cars"',
            data: interestOverTimeData,
            borderColor: "rgb(255, 99, 132)",
            fill: false,
          },
        ],
      };

      // Send the chart data to the client
      res.json(chartData);
    })
    .catch(function (err) {
      console.log(`Error: ${err}`);
      res.status(500).send('Error retrieving chart data');
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
