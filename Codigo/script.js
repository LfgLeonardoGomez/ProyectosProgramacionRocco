const botonMenu=document.querySelector('.boton-menu');
const menuLateral=document.querySelector('.menu-lateral');

botonMenu.addEventListener('click',()=>{
    menuLateral.classList.toggle('activo');
})