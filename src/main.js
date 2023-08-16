const hydro = new Hydrolang();
const compute= new hydroCompute();


let isHistoricalLoaded = false;
let isForecastLoaded = false;
let isDailyAverageLoaded = false;

let currentStationLocation = {};
window.clean_stations = [];


// helper function
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  if (!isHistoricalLoaded){
      retrieveHistoricalValues(currentStationLocation);
  }

  if (!isForecastLoaded){
    retrieveForecastValues(currentStationLocation);
  }

  // if (!isDailyAverageLoaded){
  //   retrieveDailyAveragesValues(currentStationLocation);
  // }  
}

//styling functions

function showOverlay() {
  overlay.style.display = "block";
}

function hideOverlay(event) {
  if (event.target.id === "overlay") {
    overlay.style.display = "none";
  }
}

window.addEventListener("click", hideOverlay);

async function retrieveData() {
  let data = await hydro.data.retrieve({
    params: { source: "waterOneFlow", datatype: "GetSitesByBoxObject" },
    args: {
      sourceType: "USGS Daily Values",
      east: -111.5592,
      west: -112.037,
      north: 41.07,
      south: 40.5252
    }
  });
  return data;
}

async function renderLocations() {
  let raw_stations = hydro.data.transform({
    params: { save: "site" },
    args: { type: "JSON" },
    data: await retrieveData()
  });

  for (let station of raw_stations) {
    let stgProps = {};
    stgProps.name = station.siteInfo.siteName;
    stgProps.location = station.siteInfo.geoLocation.geogLocation;
    stgProps.siteCode = station.siteInfo.siteCode;
    stgProps.variable = station.seriesCatalog.series.variable;
    clean_stations.push(stgProps);
  }

  for (let station of clean_stations) {
    const button = document.createElement("button");
    button.textContent = "Retrieve Data";

    button.addEventListener("click", function () {
        currentStationLocation =  station.location;
        isHistoricalLoaded = false
        isForecastLoaded = false
        document.getElementById('forecast-tab-content').style.display = "block";
        document.getElementById('historical-tab-content').style.display = "none";
        document.getElementById('historical-tab-content').className.replace(" active", "")
        document.getElementById('forecast-tab-content').className += " active";
        // document.getElementById('historical-tab-content').className.replace(" active", "")
        // openTab(evt, 'forecast-tab-content')
        retrieveForecastValues(currentStationLocation);
    });
    const popUpContent = document.createElement("div");
    popUpContent.innerHTML = `<h4>Station Information</h4>
    <ul>
      <li><strong>Name:</strong>${station.siteCode}</li>
      <li><strong>Latitude:</strong>${station.location.latitude}</li>
      <li><strong>Longitude:</strong>${station.location.longitude}</li>
      <li><strong>Variable:</strong>${
        station.variable && station.variable.variableName
          ? station.variable.variableName
          : "NV"
      }</li>
    </ul>`;
    popUpContent.appendChild(button);
    hydro.map.Layers({
      args: {
        type: "marker",
        name: `${station.siteCode}`,
        popUp: popUpContent
      },
      data: [
        JSON.parse(station.location.latitude),
        JSON.parse(station.location.longitude)
      ]
    });
  }
}

async function retrieveHistoricalValues(location) {
  document.getElementById('historical-loading').style.display = "flex";

  const overlay = document.getElementById("overlay");
  let chartHolder = document.getElementById("retrieved-historical-data");
  chartHolder.innerHTML = "";
  let button = document.getElementById("download-historical-btn");

  let geoglows_query = {
    source: "geoglows",
    datatype: "historic_simulation",
    transform: true
  };
  let args_query = {
    // reach_id: 9041547,
    lat: location.latitude,
    lon: location.longitude,
    return_format: "json",
  };
  let geoglows_data_historical = await hydro.data.retrieve({
    params: geoglows_query,
    args: args_query
  });
    
  let geoglows_data_transformed = [geoglows_data_historical['time_series']['datetime'],geoglows_data_historical['time_series']['flow']]

  hydro.visualize.draw({
    params: { type: "chart", id: "retrieved-historical-data" },
    data: geoglows_data_transformed
  });
  hydro.visualize.draw({
    params: { type: "table", id: "stats-historical-table" },
    data: hydro.analyze.stats.basicstats({ data: geoglows_data_transformed })
  });

  overlay.style.display = "block";

  button.removeAttribute("hidden");
  button.addEventListener("click", () => {
    hydro.data.download({ args: { type: "CSV" }, data: geoglows_data_transformed });
  });
  isHistoricalLoaded = true
  document.getElementById('historical-loading').style.display = "none";

  // // dialy averages
  // const overlay_daily_avg = document.getElementById("overlay");
  // let chartHolder_daily_avg = document.getElementById("retrieved-dailyaverage-data");
  // chartHolder_daily_avg.innerHTML = "";
  // let button_daily_avg = document.getElementById("download-dailyaverage-btn");

  // let [results, fun_names] = await computeDailyAveragesRun(location, await  geoglows_data_historical);

  // hydro.visualize.draw({
  //     params: { type: "chart", id: "retrieved-dailyaverage-data" },
  //     args:{ names: fun_names },
  //     data: results
  // });



  // overlay_daily_avg.style.display = "block";

  // button_daily_avg.removeAttribute("hidden");
  // button_daily_avg.addEventListener("click", () => {
  //   hydro.data.download({ args: { type: "CSV" }, data: results });
  // });

  // isDailyAverageLoaded = true

  showOverlay();
}



/*
retrieveForecastValues: retrieves forecast data
*/
async function retrieveForecastValues(location) {
   document.getElementById('forecast-loading').style.display = "flex";

    const overlay = document.getElementById("overlay");
    let chartHolder = document.getElementById("retrieved-forecast-data");
    chartHolder.innerHTML = "";
    let button = document.getElementById("download-forecast-btn");
  

    let geoglows_query_forecast_records = {
        source: "geoglows",
        datatype: "forecast_records",
        transform: true
    };

    let args_query_forecast_records = {
    //   reach_id: 9041547,
      lat: location.latitude,
      lon: location.longitude,
      // start_date: startDateString,
      // end_date: endDateString,
      return_format: "json",
    };
    let geoglows_forecast_records_data = await hydro.data.retrieve({
      params: geoglows_query_forecast_records,
      args: args_query_forecast_records
    });
  
  
    let geoglows_forecast_records_data_transformed = [await geoglows_forecast_records_data['time_series']['datetime'], await geoglows_forecast_records_data['time_series']['flow']]
      
    hydro.visualize.draw({
        params: { type: "chart", id: "retrieved-forecast-data" },
        data: geoglows_forecast_records_data_transformed
    });

    hydro.visualize.draw({
      params: { type: "table", id: "stats-forecast-table" },
      data: hydro.analyze.stats.basicstats({ data: geoglows_forecast_records_data_transformed })
    });
  
    overlay.style.display = "block";
  
    button.removeAttribute("hidden");
    button.addEventListener("click", () => {
      hydro.data.download({ args: { type: "CSV" }, data: geoglows_forecast_records_data_transformed });
    });
    showOverlay();
    isForecastLoaded =  true;
    document.getElementById('forecast-loading').style.display = "none";
  }

  

async function computeDailyAveragesRun(location, data) {
  //Removing the date values and leaving only the results
  // data = data[1].slice(1);
  let geoglows_data_transformed = [ data['time_series']['datetime'],  data['time_series']['flow']]

  //resetting the result spaces in the engine
  compute.availableData = [];
  compute.engineResults = {};
  compute.instanceRun = 0;

  //saving the results inside the compute library
  compute.data({ data: geoglows_data_transformed[1] });
  // let jsFuns = ["calculateMonthlyAverages_js", "calculateDailyAverages_js"];
  let jsFuns = ["matrixMultiply_js"];

  compute.setEngine("javascript");

  await compute.run({
    functions: jsFuns,
  });
  //Result holders
  let return_Values = [];
  let return_Names = [];

  //Retrieving each of the simulation runs
  let results1 = compute.results("Simulation_1")[0];


  //cleaning up some Infinity, NaN, and null values
  for (let i = 0; i < results1.functions.length; i++) {
    return_Values.push(compute.utils.cleanArray(results1.results[i]));
    return_Names.push(results1.functions[i]);
  }

  return [return_Values, return_Names];
}



// async function retrieveDailyAveragesValues(location) {
//   const overlay = document.getElementById("overlay");
//   let chartHolder = document.getElementById("retrieved-dailyaverage-data");
//   chartHolder.innerHTML = "";
//   let button = document.getElementById("download-dailyaverage-btn");

//   let [results, fun_names] = await computeDailyAveragesRun(location, await geoglows_data_historical);

//   hydro.visualize.draw({
//       params: { type: "chart", id: "retrieved-dailyaverage-data" },
//       args:{ names: fun_names },
//       data: results
//   });



//   overlay.style.display = "block";

//   button.removeAttribute("hidden");
//   button.addEventListener("click", () => {
//     hydro.data.download({ args: { type: "CSV" }, data: results });
//   });
//   showOverlay();
//   isForecastLoaded =  true;

// }



async function main() {
  hydro.map.renderMap({
    params: { maptype: "leaflet", lat: 40.75, lon: -111.87 }
  });
  renderLocations();
  const tab_forecast = document.getElementById("forecast-tab-id");
    tab_forecast.addEventListener("click", function (evt) {
      openTab(evt, 'forecast-tab-content')
    });
    const tab_historical = document.getElementById("historical-tab-id");
    tab_historical.addEventListener("click", function (evt) {
      openTab(evt, 'historical-tab-content')
    });    
    // const tab_daily_averages = document.getElementById("dailyaverage-tab-id");
    // tab_daily_averages.addEventListener("click", function (evt) {
    //   openTab(evt, 'dailyaverage-tab-content')
    // });    
}

main();



// const startDate = new Date();
// var yyyy = startDate.getFullYear();
// var mm = startDate.getMonth() + 1; // getMonth() is zero-based
// var dd = startDate.getDate();
// let startDateString = String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd

// const endDate = new Date()

// endDate.setDate(endDate.getDate() + 10)
// var yyyy = endDate.getFullYear();
// var mm = endDate.getMonth() + 1; // getMonth() is zero-based
// var dd = endDate.getDate();
// let endDateString = String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd


