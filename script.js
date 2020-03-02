// create a new moment.js object with the current date and time.
var currDateTime = moment()

// Attempt to load tasks object from local storage or return an empty object if no locally stored object is found.
var tasks = JSON.parse(localStorage.getItem("tasks")) || {};

// call displayDate function.
displayDate();

// call renderTable function.
renderTable();

// displayDate function displays todays date by calling the format method on the currDateTime object 
// to retrieve tha date in this format (Day of the week, Month Day of the month) then sets the text
// on the currentDay <p> element.

function displayDate() {
  var date = currDateTime.format("dddd, MMMM Do");
  $("#currentDay").text(date);
}

// The renderTable function select all the text input elements with a class of description and checks for the presence
// of a key in the tasks object retrieved from local storage using the data-index attribute of each selected element
// and sets the value of that item. The function then sets the time block color by setting the class to 
// (past, present or future) by calling the checkTime function.

function renderTable() {
  var timeBlocks = $(".description");
  timeBlocks.each(function(i) {
    var dataIndex = $(timeBlocks[i]).attr("data-index");
    if (tasks[dataIndex]) {
      $(timeBlocks[i]).val(tasks[dataIndex]);
    }
    $(timeBlocks[i]).removeClass("past present future");
    $(timeBlocks[i]).addClass(checkTime(dataIndex));
  });
}

// The checkTime function is called by the renderTable function on each text input element.
// The function compares the time value of the time block to the hours of the current time by parsing the data-index
// value to a moment.js object and setting the format to ("HH-mma") and getting the hour portion. 
// The output of the subtraction operation is then examined and a switch case statement is used to return a string to be 
// used as a class to change the color of the time block div.

function checkTime(timeBlock) {
  var currentHour = currDateTime.hours();
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
