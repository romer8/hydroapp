const hydro = new Hydrolang();
const compute= new hydroCompute();


//Loading
let loading_element = document.getElementById('loading-container')

//Map
let mapMarker = null;
let REACHID;
let SelectedSegment;
const ESRI_API_KEY='AAPK052bec1846714415aed2c85ddfa15f73KYexWiKoe0Au2nFQprFm_CWnafrYs4Y3MwTI3iqb-QBEwR808TRyXrudF4Za40V-';
let isHistoricalLoaded = false;
let isForecastLoaded = false;
let isDailyAverageLoaded = false;

window.clean_stations = [];

window.addEventListener("click", hideOverlay);


// helper functions
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className="tablinks";
  }
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className = "tablinks active";

  if (!isHistoricalLoaded){
      retrieveHistoricalValues(REACHID);
  }

  if (!isForecastLoaded){
    retrieveForecastValues(REACHID);
  }

  // if (!isDailyAverageLoaded){
  //   retrieveDailyAveragesValues(currentStationLocation);
  // }  
}






async function retrieveHistoricalValues(reachid) {
  loading_element.style.display = "flex";
  document.getElementById('stats-historical-table').innerHTML = ""
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
    reach_id: reachid,
    // lat: location.latitude,
    // lon: location.longitude,
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
  loading_element.style.display = "none";

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
async function retrieveForecastValues(reachid) {
    loading_element.style.display = "flex";

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
      reach_id: reachid,
      return_format: "json",
    };
    let geoglows_forecast_records_data = await hydro.data.retrieve({
      params: geoglows_query_forecast_records,
      args: args_query_forecast_records
    });

    let geoglows_query_forecast_ensembles = {
      source: "geoglows",
      datatype: "forecast_ensembles",
      transform: true
    };
    let geoglows_forecast_ensembles_data = await hydro.data.retrieve({
      params: geoglows_query_forecast_ensembles,
      args: args_query_forecast_records
    });
    
    let geoglows_forecast_records_data_transformed = [await geoglows_forecast_records_data['time_series']['datetime'], await geoglows_forecast_records_data['time_series']['flow']]
    let geoglows_forecast_ensembles_data_transformed = [await geoglows_forecast_ensembles_data['time_series']['datetime'], await geoglows_forecast_records_data['time_series']['flow'],await geoglows_forecast_ensembles_data['time_series']['ensemble_01_m^3/s'], await geoglows_forecast_ensembles_data['time_series']['ensemble_02_m^3/s'],await geoglows_forecast_ensembles_data['time_series']['ensemble_03_m^3/s']]
      
    // hydro.visualize.draw({
    //     params: { type: "chart", id: "retrieved-forecast-data" },
    //     data: geoglows_forecast_records_data_transformed
    // });
    hydro.visualize.draw({
      params: { type: "chart", id: "retrieved-forecast-data" },
      data: geoglows_forecast_ensembles_data_transformed
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
    loading_element.style.display = "none";
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

async function render_map_and_layers(){
  
  let layerAnimationTime = new Date();
  layerAnimationTime = new Date(layerAnimationTime.toISOString())
  layerAnimationTime.setUTCHours(0)
  layerAnimationTime.setUTCMinutes(0)
  layerAnimationTime.setUTCSeconds(0)
  layerAnimationTime.setUTCMilliseconds(0)
  const startDateTime = new Date(layerAnimationTime)
  const endDateTime = new Date(layerAnimationTime.setUTCHours(5 * 24))
  layerAnimationTime = new Date(startDateTime)
  const mapObj = L.map("map", {
    zoom: 3,
    minZoom: 2,
    boxZoom: true,
    maxBounds: L.latLngBounds(L.latLng(-100, -225), L.latLng(100, 225)),
    center: [20, 0]
  })
  L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", {
    apikey: ESRI_API_KEY
  }).addTo(mapObj);
  // L.esri.basemapLayer("Topographic").addTo(mapObj)
  let SelectedSegment = L.geoJSON(false, { weight: 5, color: "#00008b" }).addTo(mapObj)

  const globalLayer = L.esri
    .dynamicMapLayer({
        url:
            "https://livefeeds2.arcgis.com/arcgis/rest/services/GEOGLOWS/GlobalWaterModel_Medium/MapServer",
        useCors: false,
        layers: [0],
        from: startDateTime,
        to: endDateTime
    })
    .addTo(mapObj)

    mapObj.on("click", function(event) {
      if (mapObj.getZoom() <= 9.5) {
          mapObj.flyTo(event.latlng, 10);
          return
      } else {
          mapObj.flyTo(event.latlng)
      }
      if (mapMarker) {
          mapObj.removeLayer(mapMarker)
      }
      mapMarker = L.marker(event.latlng).addTo(mapObj)
      // updateStatusIcons("identify")
      // $("#chart_modal").modal("show")
  
      L.esri
          .identifyFeatures({url: "https://livefeeds2.arcgis.com/arcgis/rest/services/GEOGLOWS/GlobalWaterModel_Medium/MapServer"})
          .on(mapObj)
          // querying point with tolerance
          .at([event.latlng["lat"], event.latlng["lng"]])
          .tolerance(10) // map pixels to buffer search point
          .precision(3) // decimals in the returned coordinate pairs
          // .returnGeometry(false)  // include geojson geometry
          .run(function(error, featureCollection) {
              if (error) {
                  updateStatusIcons("fail")
                  alert("Error finding the reach_id")
                  return
              }
              SelectedSegment.clearLayers()
              SelectedSegment.addData(featureCollection.features[0].geometry)
              REACHID = featureCollection.features[0].properties["COMID (Stream Identifier)"]
              isHistoricalLoaded = false
              isForecastLoaded = false
              document.getElementById('forecast-tab-content').style.display = "block";
              document.getElementById('historical-tab-content').style.display = "none";
              document.getElementById('historical-tab-id').className = "tablink"
              document.getElementById('forecast-tab-id').className += " active";
              retrieveForecastValues(REACHID);
          })
  })
}

async function main() {
  render_map_and_layers();

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




