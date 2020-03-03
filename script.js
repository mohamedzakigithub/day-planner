// Attempt to load tasks object from local storage or return an empty object if no locally stored object is found. 
var tasks = JSON.parse(localStorage.getItem("tasks")) || {};
// set interval to display data every one minuit. 
var interval = setInterval(displayData, 60000);
// call displayData function when the page loads. 
displayData();

// displayData function checks the current time and compares it to the end of working day time (6 PM) and displays todays
// date into the current date element and calls the renderTable function or display a message and clear the Interval.

function displayData() {
  var dateTime = moment();
  var dayEnd = moment("06:00 PM", "HH-mma");
  if (dateTime.isAfter(dayEnd)) {
    $("#currentDay").text("Working hours ended");
    renderTable();
    clearInterval(interval);
  } else {
    $("#currentDay").text(dateTime.format("dddd, MMMM Do"));
    renderTable();
  }
}

// The renderTable function select all the text input elements with a class of description and checks for the presence 
// of a key in the tasks object retrieved from local storage and used using the data-index attribute of each selected element
// and sets the value to that item. The function then sets the time block color by setting the class (past, present or future)
// by calling the checkTime function. 

function renderTable() {
  var timeBlocks = $(".description");
  timeBlocks.each(function(i) {
    var dataIndex = $(timeBlocks[i]).attr("data-index");
    if (tasks[dataIndex]) {
      $(timeBlocks[i]).val(tasks[dataIndex]);
    }
    $(timeBlocks[i]).removeClass( "past present future" )
    $(timeBlocks[i]).addClass(checkTime(dataIndex));
  });
}

// The check time function is called by the renderTable function on each text input element. 
// The function compares the time value of the div to the hours of the current time by parsing the data-index 
// value to a monemnt,js object and setting the format to ("HH-mma"). The output of the subtraction operation
// is then examined and a switch case statement is used to return a string to be used as a class to change the 
// color of the time block.

function checkTime(timeBlock) {
  var currentHour = moment().hours();
  var timeBlockHour = moment(timeBlock, "HH-mma").hours();
  var timeDiff = timeBlockHour - currentHour;
  switch (true) {
    case timeDiff < 0:
      return "past";
      break;
    case timeDiff > 0:
      return "future";
      break;
    case timeDiff === 0:
      return "present";
      break;
  }
}

// Click Event handler of the save button assigned to each time block containing a callback function that sets the key and 
// the data of the tasks object by capturing the text input value corresponding to the button's data-index attribute 
// and then writes the object to local storage. 

$(".saveBtn").on("click", function() {
  key = $(this).attr("data-index");
  data = $('.description[data-index="' + key + '"]').val();
  tasks[key] = data;
  localStorage.setItem("tasks", JSON.stringify(tasks));
});
