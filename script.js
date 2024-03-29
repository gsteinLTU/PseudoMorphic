
var draggingEnabled = true;

// Add dragging capability to dialog
function dragElement(elmnt, useHeader = false) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (useHeader && elmnt.querySelector(":scope header")) {
    // Drag by header
    elmnt.querySelector(":scope header").onpointerdown = dragMouseDown;
  } else {
    // Drag by anywhere on element
    elmnt.onpointerdown = dragMouseDown;
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
  Array.prototype.forEach.call(elmnt.querySelectorAll(":not(header, div, content, label)"), e => e.addEventListener("pointerdown", disableDrag));
  addEventListener("pointerup", enableDrag);
  addEventListener("pointerout", enableDrag);

  Array.prototype.forEach.call(elmnt.querySelectorAll("div.expand"), e => e.addEventListener("pointerdown", disableDrag));
  Array.prototype.forEach.call(elmnt.querySelectorAll("div.expand"), e => e.addEventListener("pointerup", enableDrag));

  let lastActive = null;

  function dragMouseDown(e) {

    if (!draggingEnabled || e.button != 0) { return; }
    e = e || window.event;
    lastActive = document.activeElement;

    // Get initial mouse position
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.documentElement.addEventListener("pointerup", closeDragElement);

    // Update position on mousemove
    document.documentElement.addEventListener("pointermove", elementDrag);
  }

  function elementDrag(e) {
    if (!draggingEnabled) { return; }

    e = e || window.event;

    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // set new position
    elmnt.style.top = Math.min(window.innerHeight - elmnt.getBoundingClientRect().height / 2, Math.max(elmnt.getBoundingClientRect().height / 2, elmnt.offsetTop - pos2)) + "px";
    elmnt.style.left = Math.min(window.innerWidth - elmnt.getBoundingClientRect().width / 2, Math.max(elmnt.getBoundingClientRect().width / 2, elmnt.offsetLeft - pos1)) + "px";
  }

  // Stop dragging
  function closeDragElement() {
    document.documentElement.removeEventListener("pointerup", closeDragElement);
    document.documentElement.removeEventListener("pointermove", elementDrag);
    draggingEnabled = true;

    
    // Refocus previous element based on type
    if (lastActive) {
      const dont_refocus = ['select', 'button'];
      if (!dont_refocus.includes(lastActive.tagName.toLowerCase())) {
        lastActive.focus();
        lastActive = null;
      }
    }
  }

  // Keep in window
  addEventListener("resize", function(e) {
    elmnt.style.top = Math.min(window.innerHeight - elmnt.getBoundingClientRect().height / 2, Math.max(elmnt.getBoundingClientRect().height / 2, elmnt.offsetTop)) + "px";
    elmnt.style.left = Math.min(window.innerWidth - elmnt.getBoundingClientRect().width / 2, Math.max(elmnt.getBoundingClientRect().width / 2, elmnt.offsetLeft)) + "px";
  });
}

// Setup expand widget for dialog
function expandElement(elmnt, minWidth = null, minHeight = null) {
  // Auto-set min size
  if (minWidth == null) {
    elmnt.show();
    minWidth = elmnt.clientWidth;
    elmnt.close();
  }

  if (minHeight == null) {
    elmnt.show();
    minHeight = elmnt.clientHeight;
    elmnt.close();
  }

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var startWidth, startHeight, startTop, startLeft;
  elmnt.querySelector(":scope .expand").addEventListener("pointerdown", expandMouseDown);

  function expandMouseDown(e) {
    e = e || window.event;
    lastActive = document.activeElement;

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.documentElement.addEventListener("pointerup", closeExpandElement);
    // call a function whenever the cursor moves:
    document.documentElement.addEventListener("pointermove", expandElementDrag);
    draggingEnabled = false;
    startWidth = elmnt.getBoundingClientRect().width;
    startHeight = elmnt.getBoundingClientRect().height;
    startLeft = elmnt.getBoundingClientRect().left;
    startTop = elmnt.getBoundingClientRect().top;

    // Always allow current size
    if (startWidth < minWidth) {
      minWidth = startWidth;
    }

    if (startHeight < minHeight) {
      minHeight = startHeight;
    }
  }

  function expandElementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - Math.min(window.innerWidth, e.clientX - 30);
    pos2 = pos4 - Math.min(window.innerHeight, e.clientY - 30);

    // set the element's new position:
    const newWidth = Math.max(startWidth - pos1, minWidth);
    const newHeight = Math.max(startHeight - pos2, minHeight);
    const newTop = (startTop + elmnt.getBoundingClientRect().height / 2);
    const newLeft = (startLeft + elmnt.getBoundingClientRect().width / 2);

    // set the element's new position and dimensions:
    elmnt.style.width = newWidth + "px";
    elmnt.style.left = newLeft + "px";
    elmnt.style.height = newHeight + "px";
    elmnt.style.top = newTop + "px";
  }

  function closeExpandElement() {
    /* stop moving when mouse button is released:*/
    document.documentElement.removeEventListener("pointerup", closeExpandElement);
    document.documentElement.removeEventListener("pointermove", expandElementDrag);
    draggingEnabled = true;

    // Refocus previous element
    if (lastActive) {
      lastActive.focus();
      lastActive = null;
    }
  }
}

// Move the given element to the front of all elements matching the selector
function moveToFront(elem, selector) {
  let maxIndex = Math.max(...Array.prototype.map.call(document.querySelectorAll(selector), e => e.style['z-index'] || 0));

  if (maxIndex < 1) {
    maxIndex = 1;
  }

  if (elem.style['z-index'] != maxIndex) {
    elem.style['z-index'] = maxIndex + 1;
  }
}

// Setup dialog with dragging, expanding, close button, focus on click
function setupDialog(dialog, expandable = true) {
  dragElement(dialog);

  if (expandable) {
    expandElement(dialog);
  }

  dialog.addEventListener("pointerdown", moveToFront.bind(null, dialog, "dialog"));

  dialog.addEventListener('pointerdown', function(e) {
    if (e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  });

  const closeButton = dialog.querySelector(':scope button.close');
  if (closeButton) {
    closeButton.onclick = () => {
      hideDialog(dialog);
    };
  }
};

// Display dialog and peform other setup
function showDialog(dialog) {
  if (!dialog.style['display'] || dialog.style['display'] == 'none') {
    dialog.inert = true;
    dialog.show();
    dialog.inert = false;
    dialog.style.display = 'flex';

    // Check if off screen
    let r = dialog.getBoundingClientRect();
    if (r.x < 0 || r.y < 0) {
      // Recenter
      dialog.style.top = (window.innerHeight / 2) + 'px';
      dialog.style.left = (window.innerWidth / 2) + 'px';
    }

    moveToFront(dialog, "dialog");
  }
};

// Hide a dialog
function hideDialog(dialog) {
  dialog.close();
  dialog.style.display = '';
};

// Create a dialog element easily, add content after
function createDialog(title = '', expandable = true, buttons = ['Close']) {
  let element = document.createElement('dialog');
  element.className = 'pseudo-morphic';

  let header = document.createElement('header');
  header.innerText = title;
  element.appendChild(header);

  let content = document.createElement('content');
  element.appendChild(content);

  // Setup buttons
  let buttonbar = document.createElement('div');
  buttonbar.style['margin-top'] = 'auto';

  buttons.forEach(b => {
    let button = document.createElement('button');
    button.innerText = b;
    button.tabIndex = '-1';

    // We can set up the close button to be recognized later
    if (b == 'Close') {
      button.className = 'close';
    }

    buttonbar.appendChild(button);
  });

  element.appendChild(buttonbar);

  // Create expand widget
  if (expandable) {
    let expando = document.createElement('div');
    expando.className = 'expand';

    for (let i = 0; i < 3; i++) {
      let diag = document.createElement('div');
      diag.innerText = '⟋';
      expando.appendChild(diag);
    }

    element.appendChild(expando);
  }

  document.body.appendChild(element);
  return element;
}

function pmAlert(title, text) {
  let dialog = createDialog(title, false);
  dialog.querySelector('content').innerHTML += text;
  let oldOnClick = dialog.querySelector('button').onclick;
  dialog.querySelector('button').onclick = (ev) => {
    oldOnClick(ev);
    dialog.remove();
  };
  setupDialog(dialog, false);
  showDialog(dialog);
  moveToFront(dialog, "dialog");
  setTimeout(() => {  moveToFront(dialog, "dialog") }, 100);
}

function setDialogTitle(dialog, newTitle) {
  let header = dialog.querySelector("header");
  header.innerText = newTitle;
}
