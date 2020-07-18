const socket=io()

const btn= document.getElementById('ann2')
socket.on('connect',()=>{
    console.log('connected');
    let id= document.getElementById("userid").value;
    socket.emit('joinnotification',id)
});

socket.on('newNotification',data=>{
    console.log(data);
    const notfiRegests=document.getElementById('notfiRequets')
    notfiRegests.innerHTML += `
        <p>${data.notfiContant}</p>
    `

btn.classList.remove('tonn')
btn.classList.add('tomm')
})

btn.onclick = () =>{
    btn.classList.remove('tomm')
btn.classList.add('tonn')
}