const scale = 2;

let room;
let dimensions;

let currentId;
let snap = true;

$(document).ready(() => {
  load();
  render();
});

$(document).on("keypress", function (keyEvent) {
  console.log(keyEvent.which);
  switch (keyEvent.which) {
    // di(M)ensions
    case 109: {
      setDimensions();
      save();
      render();
      break;
    }
    // (D)elete
    case 100: {
      room = room
        .filter((i) => i.id != currentId)
        .map((item, index) => ({ ...item, id: index }));
      save();
      render();
      break;
    }
    // (R)otate
    case 114: {
      rotate();
      render();
      break;
    }
    // (S)napping
    case 115: {
      snap = !snap;
      render();
      break;
    }
    // (N)ew
    case 110: {
      const item = {
        id: room.length,
        name: promptUser("name", "object"),
        h: promptUser("height", "100") * 2,
        w: promptUser("width", "100") * 2,
        color: promptUser("color in hex", "#FFFFFF"),
        top: 0,
        left: 0,
      };
      room.push(item);
      render();
      break;
    }
    // save to (C)ookie
    case 99: {
      save();
      break;
    }
    // (L)oad from cookie
    case 108: {
      load();
      render();
      break;
    }
  }
});

function save() {
  localStorage.setItem("room", JSON.stringify(room));
  localStorage.setItem("dimensions", JSON.stringify(dimensions));
}

function load() {
  room = JSON.parse(localStorage.getItem("room")) || [];
  dimensions = JSON.parse(localStorage.getItem("dimensions")) || [300, 400];
}

function promptUser(property, defaultVal) {
  return prompt(`Please enter item ${property}`, defaultVal);
}

function rotate() {
  if (!room[currentId]) return;
  const { w, h } = room[currentId];
  room[currentId].h = w;
  room[currentId].w = h;
  render();
}

function render() {
  console.log("render", { snap });

  $room = $("#room");
  $room.empty();

  $room.width(dimensions[0] * scale).height(dimensions[1] * scale);

  for (const item of room) {
    $("<div/>", {
      class: `item`,
      id: item.id,
    })
      .css({
        width: item.w,
        height: item.h,
        backgroundColor: item.color,
        left: item.left,
        top: item.top,
      })
      .append(`<h1>${item.name}</h1>`)
      .appendTo($room);
  }

  // Make all draggable
  $(".item").draggable({
    snap,
    containment: "parent",
    cursor: "pointer",
    start: function (event, ui) {
      currentId = event.target.id;
      select();
    },
    stop: function (event, ui) {
      const id = this.id;
      room[id].left = this.style.left;
      room[id].top = this.style.top;
      save();
    },
  });

  select();

  $("#raw").text(JSON.stringify(room, null, 2));
}

function setDimensions() {
  const w = prompt(`Enter room width`, 300);
  const h = prompt(`Enter room height`, 400);
  dimensions = [parseFloat(w) || 300, parseFloat(h) || 400];
}

function select() {
  $(".item").removeClass("selected");
  $(`#${currentId}`).addClass("selected");
}
