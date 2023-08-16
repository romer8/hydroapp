// helper functions
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
        retrieveHistoricalValues(REACHID);
    }
  
    if (!isForecastLoaded){
      retrieveForecastValues(REACHID);
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
  