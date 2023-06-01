
var draggingEnabled = true;

// Add dragging capability to dialog
function dragElement(elmnt, useHeader = false) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  if (useHeader && elmnt.querySelector(":scope header")) {
    // Drag by header
    elmnt.querySelector(":scope header").onmousedown = dragMouseDown;
  } else {
    // Drag by anywhere on element
    elmnt.onmousedown = dragMouseDown;
  }

  // Prevent dragging
  function disableDrag(e) {
    draggingEnabled = false;
  }

  // Re-enable dragging
  function enableDrag(e) {
    draggingEnabled = true;
  }

  // Prevent dragging on things that shouldn't cause it
  Array.prototype.forEach.call(elmnt.querySelectorAll(":not(header, div)"), e => e.addEventListener("mousedown", disableDrag));
  Array.prototype.forEach.call(elmnt.querySelectorAll(":not(header, div)"), e => e.addEventListener("mouseup", enableDrag));

  Array.prototype.forEach.call(elmnt.querySelectorAll("div.expand"), e => e.addEventListener("mousedown", disableDrag));
  Array.prototype.forEach.call(elmnt.querySelectorAll("div.expand"), e => e.addEventListener("mouseup", enableDrag));

  function dragMouseDown(e) {
    e = e || window.event;
    
    // Get initial mouse position
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.documentElement.addEventListener("mouseup", closeDragElement);
    
    // Update position on mousemove
    document.documentElement.addEventListener("mousemove", elementDrag);
  }

  function elementDrag(e) {
    if(!draggingEnabled) { return; }
    
    e = e || window.event;
    e.preventDefault();
    
    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // set new position
    elmnt.style.top = Math.min(window.screen.height - elmnt.getBoundingClientRect().height / 2, Math.max(dialog.getBoundingClientRect().height / 2, elmnt.offsetTop - pos2)) + "px";
    elmnt.style.left = Math.min(window.screen.width - elmnt.getBoundingClientRect().width / 2, Math.max(dialog.getBoundingClientRect().width / 2, elmnt.offsetLeft - pos1)) + "px";
  }

  // Stop dragging
  function closeDragElement() {
    document.documentElement.removeEventListener("mouseup", closeDragElement);
    document.documentElement.removeEventListener("mousemove", elementDrag);
    draggingEnabled = true;
  }

  // Keep in window
  addEventListener("resize", function(e) {
    elmnt.style.top = Math.min(window.screen.height - dialog.getBoundingClientRect().height / 2, Math.max(dialog.getBoundingClientRect().height / 2, elmnt.offsetTop)) + "px";
    elmnt.style.left = Math.min(window.screen.width - dialog.getBoundingClientRect().width / 2, Math.max(dialog.getBoundingClientRect().width / 2, elmnt.offsetLeft)) + "px";
  });
}

// Setup expand widget for dialog
function expandElement(elmnt, minWidth = 400, minHeight = 150) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var startWidth, startHeight, startTop, startLeft;
  elmnt.querySelector(":scope .expand").addEventListener("mousedown", expandMouseDown);
  
  function expandMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.documentElement.addEventListener("mouseup", closeExpandElement);
    // call a function whenever the cursor moves:
    document.documentElement.addEventListener("mousemove", expandElementDrag);
    draggingEnabled = false;
    startWidth = elmnt.getBoundingClientRect().width;
    startHeight = elmnt.getBoundingClientRect().height;
    startLeft = elmnt.getBoundingClientRect().left;
    startTop = elmnt.getBoundingClientRect().top;

    // Always allow current size
    if(startWidth < minWidth) {
      minWidth = startWidth;
    }
    
    if(startHeight < minHeight) {
      minHeight = startHeight;
    }
  }

  function expandElementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    // set the element's new position:
    elmnt.style.width = Math.max(startWidth - pos1, minWidth) + "px";
    elmnt.style.height = Math.max(startHeight - pos2, minHeight) + "px";
    elmnt.style.top = (startTop + elmnt.getBoundingClientRect().height / 2) + "px";
    elmnt.style.left = (startLeft + elmnt.getBoundingClientRect().width / 2) + "px";
  }

  function closeExpandElement() {
    /* stop moving when mouse button is released:*/
    document.documentElement.removeEventListener("mouseup", closeExpandElement);
    document.documentElement.removeEventListener("mousemove", expandElementDrag);
    draggingEnabled = true;
  }
}

// Move the given element to the front of all elements matching the selector
function moveToFront(elem, selector) {
  let maxIndex = Math.max(...Array.prototype.map.call(document.querySelectorAll(selector), e => e.style['z-index'] || 0));

  if(maxIndex < 1) {
    maxIndex = 1;
  }
  
  if(elem.style['z-index'] != maxIndex) {
    elem.style['z-index'] = maxIndex + 1;
  }
}

// Setup dialog with dragging, expanding, close button, focus on click
function setupDialog(dialog) {
  dragElement(dialog);
  expandElement(dialog);
  dialog.addEventListener("mousedown", moveToFront.bind(null, dialog, "dialog"));
  
  const closeButton = dialog.querySelector(':scope button.close');
  if(closeButton) {
    closeButton.onclick = () => {
      dialog.close();
      dialog.style.display = '';
    };
  }
};

// Display dialog and peform other setup
function showDialog(dialog) {
  dialog.show();
  dialog.style.display = 'flex';

  const dialogWidth = dialog.getBoundingClientRect().width;
  dialog.style.width = dialogWidth + 'px';
};
