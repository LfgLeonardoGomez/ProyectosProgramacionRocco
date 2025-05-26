// ================================
//   LÓGICA DEL MENÚ DESPLEGABLE
// ================================
const botonMenu = document.querySelector('.boton-menu');
const menuLateral = document.querySelector('.menu-lateral');

botonMenu.addEventListener('click', () => {
    menuLateral.classList.toggle('activo');
    botonMenu.classList.toggle('activo');
});

// ================================
//     CARGA DINÁMICA DEL MENÚ
// ================================
fetch('../js/pizzas.json')
    .then(response => response.json())
    .then(data => {
        const mainMenu = document.querySelector('.main-menu');

        data.forEach(pizza => {
            const section = document.createElement('section');
            section.classList.add('section-menu');

            const card = document.createElement('div');
            card.classList.add('card');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.innerHTML = `
                <img src="${pizza.imagen}" alt="${pizza.nombre}">
                <div>
                    <h3>${pizza.nombre}</h3>
                </div>
            `;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.innerHTML = `
                <p>${pizza.descripcion}</p>
            `;

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            section.appendChild(card);
            mainMenu.appendChild(section);

            gsap.from(section, {
                duration: 0.5,
                opacity: 0,
                y: 50,
                ease: "power2.out"
            });
        });
    })
    .catch(error => console.error('Error cargando el menú:', error));

// ================================
//     LÓGICA DEL POPUP LOGIN
// ================================
const modalLogin = document.getElementById("modal-login");
const btnPedido = document.getElementById("realizar-pedido-btn");
const spanCloseLogin = modalLogin.querySelector(".close");

btnPedido.onclick = () => {
    modalLogin.style.display = "block";
};

spanCloseLogin.onclick = () => {
    modalLogin.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modalLogin) {
        modalLogin.style.display = "none";
    }
};

// ================================
//     LÓGICA DEL POPUP REGISTRO
// ================================
const modalRegistro = document.getElementById("modal-registro");
const registrarseLink = document.getElementById("registrarse-link");
const spanCloseRegistro = modalRegistro.querySelector(".close");

// Abrir el modal de registro desde el enlace
registrarseLink.onclick = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    modalLogin.style.display = "none"; // Cierra el login
    modalRegistro.style.display = "block"; // Abre el registro
};

// Cerrar el modal de registro
spanCloseRegistro.onclick = () => {
    modalRegistro.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modalRegistro) {
        modalRegistro.style.display = "none";
    }
};


//     LÓGICA DEL login

document.getElementById('login-form').addEventListener('submit', async (e) => {
 

  e.preventDefault();

  const dni = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log("📥 Enviando login con DNI:", dni);
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      alert('✅ ' + data.mensaje);
      modalLogin.style.display = "none";
      
      window.location.href = "realizarPedido.html";

      document.getElementById('login-form').reset();

    } else {
      alert('❌ ' + data.mensaje);
    }
  } catch (error) {
    alert('❌ Error de conexión al servidor');
    console.error(error);
  }
});

//     LÓGICA DEL registro

document.getElementById('registro-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const email = document.getElementById('email').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const password = document.getElementById('password-registro').value;

  try {
    const response = await fetch('http://localhost:3000/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, dni, email, direccion, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`✅ ${data.mensaje}\nTu DNI: ${dni}\nTu contraseña: ${password}`);
      document.getElementById('registro-form').reset();
      document.getElementById('modal-registro').style.display = 'none';
      document.getElementById('modal-login').style.display = 'block'; // Abrir el modal de login

         setTimeout(() => {
        document.getElementById('username').focus();
        document.getElementById('username').value = dni; // también se puede autocompletar el DNI
      }, 200);
    } else {
      alert('❌ ' + data.mensaje);
    }
  } catch (error) {
    alert('❌ Error de conexión al servidor');
    console.error('Error:', error);
  }
});
