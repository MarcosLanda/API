//URL de la API
const API_URL = "https://retoolapi.dev/GMew04/data" ;

//funcion que manda a traer el JSON
async function obtenerPersonas() {
    //Respuesta del servidor
    const res = await fetch(API_URL)//Se hace una llamada a la endpoint

    //pasamos a JSON la respuesta del servidor
    const data = await res.json();//Esto es un JSON

    //Enviamos el JSON que nos manda la API a la función que crea la tabla en HTML
    mostrarDatos(data);
}

//La funcion lleva un parametro "datos" que representa al JSON
function mostrarDatos(datos){
    //Se llama al tbody dentro del elemento con id "tabla"
    const tabla = document.querySelector('#tabla tbody');
    tabla.innerHTML = '';//Vaciamos el contenido de la tabla

    datos.forEach(persona => {
        tabla.innerHTML += `
            <tr>
                <td>${persona.id}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.email}</td>
                <td>${persona.edad}</td>
                <td>
                    <button onclick="AbrirModalEditar(${persona.id}, '${persona.nombre}', '${persona.apellido}', '${persona.email}','${persona.edad}' )">Editar</button>
                    <button onClick="EliminarPersona(${persona.id})">Eliminar</button>
                </td>
            </tr>
        `
    });
}

//LLamada inicial para que se carguen los datos que vienen del servidor
obtenerPersonas();


//Agregar un nuevo registro
const modal = document.getElementById("modal-agregar");
const btnAgregar = document.getElementById("btnAbrirModal");
const btnCerrar = document.getElementById("btnCerrarModal");

btnAgregar.addEventListener("click", () => {
    modal.showModal(); //abrir el modal al hacer clic en el boton
});

btnCerrar.addEventListener("click", () => {
    modal.close(); //Cerra modal
});

//agregar nuevo integrante desde el formulario
document.getElementById("frmAgregar").addEventListener("submit", async e => {
    e.preventDefault(); //e representa "submit" - evita que el formulario se envie de golpe

    //capturar los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const edad = document.getElementById("edad").value.trim();

    //validacion basica
    if(!nombre || !apellido || !email || !edad){
        alert("Complete todos los campos");
        return; //Evitar que el formulario se envie
    }

    //Llamar a la API para enviar el usuario
    const respuesta = await fetch(API_URL, {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre, apellido, email, edad})
    });

    if(respuesta.ok){
        alert("El registro fue agregado correctamente");

        //Limpiar el formulario y cerrar el modal
        document.getElementById("frmAgregar").reset();

        modal.close();

        //Recargar la tabla
        obtenerPersonas();

    }
    else{
        alert("Hubo un error al agregar");
    }

});

//funcion para borrar registro
async function EliminarPersona(id){
    const confirmacion = confirm("¿Estas seguro que desea borrar esta persona?");

    //validamos si el usuario dijo que si
    if(confirmacion){
        await fetch(`${API_URL}/${id}`, {method: "DELETE"});

        //Recargamos la tabla para ver la eliminacion
        obtenerPersonas();
    }
}



//Proceso para editar un registro
const modalEditar = document.getElementById("modal-editar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");

btnCerrarEditar.addEventListener("click", () => {
    modalEditar.close();
});

//Se agregan los valores del registro en los input
function AbrirModalEditar(id,nombre, apellido, email, edad){
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("apellidoEditar").value = apellido;
    document.getElementById("emailEditar").value = email;
    document.getElementById("edadEditar").value = edad;


    //Modal se abre despues de agregar los valores a los inpunt
    modalEditar.showModal();
}

document.getElementById("frmEditar").addEventListener("submit", async e =>{
    e.preventDefault(); //Evita que el formulario se envie

    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const apellido = document.getElementById("apellidoEditar").value.trim();
    const email = document.getElementById("emailEditar").value.trim();
    const edad = document.getElementById("edadEditar").value.trim();

    if(!id || !nombre || !apellido || !email || !edad){
        alert("Complete todos los campos");
        return; //Evita que el codigo se siga ejecutando
    }
    
    //Llamada a la API
    const respuesta = await fetch(`${API_URL}/${id}` , {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({edad, email, nombre, apellido})
    });

    if(respuesta.ok){
        alert("Registro actualizado con exito"); //confirmacion
        modalEditar.close(); //cerramos el modal
        obtenerPersonas(); //Actualizamos la lista
    }
    else{
        alert("Hubo un error al actualizar");
    }
});
