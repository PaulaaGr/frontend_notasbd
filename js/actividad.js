let indexActividad = 0;

$(document).ready(function () {
    mostrarActividad();
});

function mostrarActividad() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/verActividades/'
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const actividades = dataJson.data;
        const table = document.getElementById('actividadesTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';
        let notas = [];

        actividades.forEach(actividad => {
            html += '<tr>';
            html += '   <td>' + actividad.id + '</td>';
            html += '   <td>' + actividad.descripcion + '</td>';
            html += '   <td>' + actividad.nota + '</td>';
            html += '   <td>';
            html += '      <button onclick="modificar(' + actividad.id + ')">Modificar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <button onclick="eliminar(' + actividad.id + ')">Eliminar</button>';
            html += '   </td>';
            html += '</tr>';

            notas.push(parseFloat(actividad.nota));
        });

        tbody.innerHTML = html;
    }).fail((error) => {
        console.error(error);
    });
}


document.getElementById('registrar').addEventListener('click', () => {
    indexActividad = -1;
    document.getElementById('tituloModal').innerText = 'Registrar';
});

document.getElementById('guardar').addEventListener('click', () => {
    let formulario = document.forms['formularioActividad'];
    let descripcion = formulario['descripcion'].value;
    let nota = formulario['nota'].value;

    if (descripcion === "" || nota === "" ) {
        alert("Complete los campos.");
        return;
    }

    if (indexActividad == -1) {
        $.ajax({
            url: 'http://localhost:8000/crearActividad',
            method: 'post',
            data: {
                descripcion: descripcion,
                nota: nota,
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            mostrarActividad();
            location.reload();
        });
    } else if (indexActividad == 1) {
        let formularioModificar = document.forms['formularioActividad'];
        let descripcionModificar = formularioModificar['descripcion'].value;
        let notaModificar = formularioModificar['nota'].value;

        if (descripcionModificar === "" || notaModificar === "") {
            alert("Complete los campos.");
            return;
        }

        $.ajax({
            url: 'http://localhost:8000/modificarActividad/' + id,
            method: 'put',
            data: {
                descripcion: descripcionModificar,
                nota: notaModificar,
            }
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            mostrarActividad();
            location.reload();
        });
    }
});

let modificar = function (actividadId) {
    document.getElementById('tituloModal').innerText = 'Modificar';
    indexActividad = 1;
    id = actividadId;
};

let eliminar = function (id) {
    $.ajax({
        url: 'http://localhost:8000/eliminarActividad/' + id,
        method: 'delete',
    }).done(response => {
        const dataJson = JSON.parse(response);
        const msg = dataJson.data;
        alert(msg);
        mostrarActividad();
        location.reload();
    });
};