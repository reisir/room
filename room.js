let scale = 2;
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
    // scal(E)
    case 101: {
      setScale();
      save();
      render();
      break;
    }
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
      save();
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
        name: prompt(`Enter item name`, ""),
        h: parseFloat(prompt(`Enter item height`, 50)),
        w: parseFloat(prompt(`Enter item width`, 150)),
        color: prompt(`Enter item color`, "#FFFFFF"),
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
  localStorage.setItem("scale", scale);
  localStorage.setItem("dimensions", JSON.stringify(dimensions));
}

function load() {
  room = JSON.parse(localStorage.getItem("room")) || [];
  scale = JSON.parse(localStorage.getItem("scale")) || 2;
  dimensions = JSON.parse(localStorage.getItem("dimensions")) || [300, 400];
}

function rotate() {
  if (!room[currentId]) return;
  const { w, h } = room[currentId];
  room[currentId].h = w;
  room[currentId].w = h;
}

function render() {
  $room = $("#room");
  $room.empty();

  $room.width(dimensions[0] * scale).height(dimensions[1] * scale);

  for (const item of room) {
    $("<div/>", {
      class: `item`,
      id: item.id,
    })
      .css({
        width: `${parseFloat(item.w) * scale}px`,
        height: `${parseFloat(item.h) * scale}px`,
        backgroundColor: item.color,
        left: `${parseFloat(item.left) * scale}px`,
        top: `${parseFloat(item.top) * scale}px`,
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
      room[id].left = parseScalePrecision(this.style.left);
      room[id].top = parseScalePrecision(this.style.top);
      save();
      rawOutput();
    },
  });

  select();
  rawOutput();
}

function rawOutput() {
  $("#raw").text(JSON.stringify(room, null, 2));
}

function parseScalePrecision(s) {
  return (parseFloat(s) / scale).toPrecision(4);
}

function setDimensions() {
  const w = prompt(`Enter room width`, dimensions[0]);
  const h = prompt(`Enter room height`, dimensions[1]);
  dimensions = [parseFloat(w) || dimensions[0], parseFloat(h) || dimensions[1]];
}

function setScale() {
  const s = prompt(`Enter render scale`, scale);
  scale = parseFloat(s) || scale;
}

function select() {
  $(".item").removeClass("selected");
  $(`#${currentId}`).addClass("selected");
}
