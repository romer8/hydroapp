/**
 * https://waterservices.usgs.gov/rest/IV-Service.html
 * This API returns stream stages for US
 * @type {Object}
 * @name GeoGLOWS
 * @memberof datasources
 */

 export default {
    "forecast": {
      endpoint: "https://geoglows.ecmwf.int/api/ForecastStats/",
      params: {
        // These are only written to aid users to know
        // what parameters are available
        reach_id: null,
        forecast_date: null,
        return_format:null
        // and more...
      },
      "data-fields": {
        // "output-data-field-1": null,
        // enter data field here
      },
      methods:{
        type: "json",
        method: "GET"
      }
    },
  
    "forecast_ensembles": {
      endpoint: "https://geoglows.ecmwf.int/api/ForecastEnsembles/",
      params: {
        // These are only written to aid users to know
        // what parameters are available
        reach_id: null,
        forecast_date: null,
        return_format:null
        // and more...
      },
      "data-fields": {
        // "output-data-field-1": null,
        // enter data field here
      },
      methods:{
        type: "json",
        method: "GET"
      }
    },
    "forecast_warnings": {
        endpoint: "https://geoglows.ecmwf.int/api/ForecastWarnings/",
        params: {
          // These are only written to aid users to know
          // what parameters are available
          region: null,
          return_format:null,
          forecast_date: null,

          // and more...
        },
        "data-fields": {
          // "output-data-field-1": null,
          // enter data field here
        },
        methods:{
          type: "json",
          method: "GET"
        }
      },
    requirements: {
      needProxy: true,
      requireskey: false,
    },
    "forecast_records": {
        endpoint: "https://geoglows.ecmwf.int/api/ForecastRecords/",
        params: {
          // These are only written to aid users to know
          // what parameters are available
          reach_id: null,
          start_date: null,
          end_date: null,
          return_format:null
          // and more...
        },
        "data-fields": {
          // "output-data-field-1": null,
          // enter data field here
        },
        methods:{
          type: "json",
          method: "GET"
        }
      },
    requirements: {
      needProxy: true,
      requireskey: false,
    },
    "historic_simulation": {
        endpoint: "https://geoglows.ecmwf.int/api/HistoricSimulation/",
        params: {
          // These are only written to aid users to know
          // what parameters are available
          reach_id: null,
          return_format:null
          // and more...
        },
        "data-fields": {
          // "output-data-field-1": null,
          // enter data field here
        },
        methods:{
          type: "json",
          method: "GET"
        }
      },
    requirements: {
      needProxy: true,
      requireskey: false,
    },
    /* DATA SOURCE 2 */
  
    /* DATA SOURCE ... */
  };
  