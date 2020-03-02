var tasks = JSON.parse(localStorage.getItem("tasks")) || {};
var interval = setInterval(displayData, 60000);
displayData();


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

$(".saveBtn").on("click", function() {
  key = $(this).attr("data-index");
  data = $('.description[data-index="' + key + '"]').val();
  tasks[key] = data;
  localStorage.setItem("tasks", JSON.stringify(tasks));
});
