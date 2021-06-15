let navActive = false
document.querySelector('.toggle').addEventListener('click', ()=>{
 navActive = !navActive
 document.querySelector('.toggle').classList.toggle('active')
 document.querySelector('.navScreen').classList.toggle('active')
})