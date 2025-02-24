// Make the DIV element draggable:
export default function dragElement (elmnt, coordCB) {
  var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0

  elmnt.querySelector('.handle').onmousedown = dragMouseDown

  function dragMouseDown (e) {
    e = e || window.event
    // e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
    // debugger
    coordCB({
      y: (elmnt.offsetTop - pos2) + 0.5 * elmnt.clientHeight,
      x: (elmnt.offsetLeft - pos1) + 0.5 * elmnt.clientWidth
    })
  }

  function closeDragElement () {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}
