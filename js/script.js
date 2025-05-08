const botonMenu = document.querySelector('.boton-menu');  
const menuLateral = document.querySelector('.menu-lateral');

botonMenu.addEventListener('click', () => {
    menuLateral.classList.toggle('activo');  
    botonMenu.classList.toggle('activo'); // Cambia la clase del botón
});
