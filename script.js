// Select time blocks DOM elements using class (description).

var timeBlockElements = $(".description");

// Attempt to load tasks object from local storage or assign it to an empty object if no locally stored version found.

var tasks = JSON.parse(localStorage.getItem("tasks")) || {};

// Populate time blocks values from the locally stored object if there is a stored value for each time block.

timeBlockElements.each(function(i) {
  var dataIndex = $(timeBlockElements[i]).attr("data-index");
  if (tasks[dataIndex]) {
    $(timeBlockElements[i]).val(tasks[dataIndex]);
  }
});

// Call the renderTable function on page load.

renderTable();

// Set a timer and assign the renderTable function as a call back function to be called every minute to ensure correct color
// representation of each time block in real time.

var interval = setInterval(renderTable, 60000);

// The renderTable function is responsible for displaying the current date on the top of the page and setting the class 
// which formats the color of the time block representing it's current time state compared to the current time.
// This is done by clearing the classes then adding the class which represents the time block status now from 
// ( past, present and future). This is achieved by creating a moment.js object representing the current time then 
// creating a new moment.js object representing the time assigned to the time block which is stored in the data-index 
// attribute, then passing those two objects to the checkTime object that returns the class name to be added to the element.

function renderTable() {
  var currentDate = moment().format("dddd, MMMM Do"); // Get current date by creating new moment.js object and call format() method on it.
  var currentTime = moment();
  $("#currentDay").text(currentDate); // Select #currentDay element and set text to currentDate.
  timeBlockElements.each(function(i) {
    var dataIndex = $(timeBlockElements[i]).attr("data-index");
    var timeBlock = moment(dataIndex, "HH-mma");
    $(timeBlockElements[i]).removeClass("past present future");
    $(timeBlockElements[i]).addClass(checkTime(timeBlock, currentTime));
  });
}

// The checkTime function is called by the renderTable function on each text input element.
// The function compares two moment.js objects by using the duration() method chained with asHours() method
// to return the time difference in hours between the two objects. The function then uses a switch case statement to return
// either (past, present or future).

function checkTime(time1, time2) {
  var timeDiff = moment.duration(time2.diff(time1)).asHours();
  switch (true) {
    case timeDiff > 1:
      return "past";
      break;
    case timeDiff > 0 && timeDiff <= 1:
      return "present";
      break;
    case timeDiff <= 0:
      return "future";
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
