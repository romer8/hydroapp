/**
 * @description Collection of geoglows time series analysis functions for the JavaScript engine
 * @member geoglows_js
 * @memberof jsScripts
 */
 export const geoglows = {
    /**
     * Calculates the exponential moving average for time series analysis.
     * @param {number[]} d - The input data.
     * @returns {number[]} - The result of monthly averages.
     */
     calculateMonthlyAverages_js: (d) => {
      const dates = d[0];
      const values = d[1];
      const monthlyAverages = {};
  
      dates.forEach((date, i) => {
          const value = values[i];
  
          const year = date.substring(0, 4);
          const month = date.substring(4, 6);
          const key = `${year}${month}`;
  
          if (!monthlyAverages[key]) {
              monthlyAverages[key] = { sum: 0, count: 0 };
          }
  
          monthlyAverages[key].sum += value;
          monthlyAverages[key].count++;
      });
  
      const resultMonths = [];
      const resultAverages = [];
  
      for (const key in monthlyAverages) {
          const { sum, count } = monthlyAverages[key];
          resultMonths.push(key);
          resultAverages.push(sum / count);
      }
  
      return [resultMonths, resultAverages];
    },
  
    /**
     * Calculates the simple moving average for time series analysis.
     * @param {number[]} d - The input data.
     * @returns {number[]} - The result of daily averages.
     */
     calculateDailyAverages_js: (d) => {
      const dates = d[0];
      const values = d[1];
      const dailyAverages = {};
  
      dates.forEach((date, i) => {
          const value = values[i];
  
          if (!dailyAverages[date]) {
              dailyAverages[date] = { sum: 0, count: 0 };
          }
  
          dailyAverages[date].sum += value;
          dailyAverages[date].count++;
      });
  
      const resultDates = [];
      const resultAverages = [];
  
      for (const date in dailyAverages) {
          const { sum, count } = dailyAverages[date];
          resultDates.push(date);
          resultAverages.push(sum / count);
      }
  
      return [resultDates, resultAverages];
    },
  
 
    /**
     * Runs the specified function in the `geoglows` object with the given data.
     * @param {string} name - The name of the function to run.
     * @param {number[]} data - The input data for the function.
     * @returns {number[]|undefined} - The result of the function, or `undefined` if the function is not found.
     */
    main: (name, data) => {
      if (typeof geoglows[name] === "undefined") {
        return console.error("Function is not found in the given script.");
      } else {
        return geoglows[name](data);
      }
    },
  };
  