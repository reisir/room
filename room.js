var scale = 1.6;
var roomDimensions = [308, 442];
var objects = [];
var currentId;
var i;
var bruh = [];

$(document).ready(() => {
  $("#room")
    .width(roomDimensions[0] * scale)
    .height(roomDimensions[1] * scale);
});

$(document).keypress(function (keyEvent) {
  switch (keyEvent.which) {
    case 114: {
      var currentW = $(currentId).width();
      $(currentId).width($(currentId).height()).height(currentW);
    }
    case 115: {
      if ($(currentId).draggable("option", "snap") == true) {
        $(currentId).draggable("option", "snap", false);
      } else {
        $(currentId).draggable("option", "snap", true);
      }
    }
    case 116: {
      var object = {
        name: promptUser("name", "object"),
        objH: promptUser("height", "100"),
        objW: promptUser("width", "100"),
        color: promptUser("color in hex", "#FFFFFF"),
      };
      objects.push(object);
      i++;
      $("#room").append(newElement(object, i));
      makeAllDraggable();
    }
    case 99: {
      Cookies.set("roomArr", JSON.stringify(objects), {
        expires: 100,
      });
    }
    case 108: {
      //Load from cookie
      console.log(Cookies.get("roomArr"));
      loadRoomArray(JSON.parse(Cookies.get("roomArr")));
    }
  }
});

function promptUser(property, defaultVal) {
  var getValue = prompt("Please enter object " + property, defaultVal);
  return getValue;
}

function newElement(object, i) {
  var html =
    '<div class="object" id="object' +
    i +
    '" style=" width:' +
    object.objW * scale +
    "px; height:" +
    object.objH * scale +
    "px; background: " +
    object.color +
    '"><h1>' +
    object.name +
    "</h1></div>";
  return html;
}

function makeAllDraggable() {
  $(".object").draggable({
    snap: true,
    containment: "parent",
    cursor: "pointer",
    start: function (event, ui) {
      currentId = "#" + $(this).attr("id");
      console.log(currentId);
    },
  });
}

function loadRoomArray(bruh) {
  bruh.forEach(function (object) {
    objects.push(object);
  });

  objects.forEach(function (object, i) {
    $("#room").append(newElement(object, i));
    i++;
  });

  makeAllDraggable();

  $(".object").click(function () {
    currentId = "#" + $(this).attr("id");
  });
}
