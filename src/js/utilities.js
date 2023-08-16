
  
  //styling functions
  
  function showOverlay() {
    overlay.style.display = "block";
  }
  
  function hideOverlay(event) {
    if (event.target.id === "overlay") {
      overlay.style.display = "none";
    }
  }
  


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