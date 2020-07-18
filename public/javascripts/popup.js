// Get the modal
var modal = document.getElementById('simpleModal');

// Get open modal button
var modalBtn = document.getElementById('modalBtn');

//Get close button
var colseBtn = document.getElementsByClassName('closeBtn')[0];

//listen for open click
modalBtn.addEventListener('click',openModal);

//listen for close click
colseBtn.addEventListener('click',closeModal);

//outside
window.addEventListener('click',outsideClick);

//open
function openModal(){
    modal.style.display='block';
}
//close
function closeModal(){
    modal.style.display='none';
}

// When the user clicks anywhere outside of the modal, close it
function outsideClick(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
