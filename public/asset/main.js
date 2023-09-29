let api =
    "https://script.google.com/macros/s/AKfycbx8ccTQK0I7SLy7J6iF1UQFjHmxeis2b2Gwh_qhHfadT_ccyJ_ApO2QlAi4y3xLEfzC/exec";
let msg = document.querySelector(".message");
let fileInput = document.querySelector(".file");
let btn = document.querySelector(".btn");
let text = document.querySelector(".text");

btn.addEventListener('click', () => {
    msg.innerHTML = 'Cargando...';
    let fr = new FileReader();
    fr.readAsDataURL(fileInput.files[0]);
    fr.onload = () => {
        let res = fr.result;
        let b64 = res.split("base64,")[1];
        fetch(api, {
            method: "POST",
            body: JSON.stringify({
                file: b64,
                type: fileInput.files[0].type,
                nombre: fileInput.files[0].nombre
            })
        })
            .then(res => res.text())
            .then(data => {
                const datos = extractData(data);
                convertToJSON(datos);
            });
    }
})

function extractData(data) {
    let nombreMatch = data.match(/(NOMBRE)[\s]([A-Z]+\s[A-Z]+(\s(?:(?!DOMICILIO)[A-Z])+){1,2})/g);
    let generoMatch = data.match(/(SEXO)[\s]([HM])/g);
    let fechaNacimientoMatch = data.match(/(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/]\d{4}/g);
    let curpMatch = data.match(/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)/g);
    let seccionMatch = data.match(/(SECCIÓN)[\s]([0-9]{4}|(VIGENCIA)\s[0-9]{4})/g);
    let claveElectorMatch = data.match(/[A-Z]{6}[0-9]{8}[HM][0-9]{3}/g);
    let domicilioMatch = data.match(/(DOMICILIO)([\s\S]*?)(CLAVE DE ELECTOR)/g);
    let domicilio = domicilioMatch ? domicilioMatch[0].replace(/DOMICILIO|CLAVE DE ELECTOR/g, '').trim().replace(/\s+/g, ' ') : '';
    let cpMatch = domicilio.match(/\d{5}/g);
    let edoMuniMatch = domicilio.match(/(\d{5})\s*(.+)/g);
    let calleMatch = domicilio.match(/(.*)(\d{5})/g);

    let nombre = nombreMatch ? nombreMatch[0].replace(/NOMBRE|DOMICILIO/g, '').trim().replace(/\s+/g, ' ') : '';
    let genero = generoMatch ? generoMatch[0].replace(/SEXO/g, '').trim() : '';
    let fechaNacimiento = fechaNacimientoMatch ? fechaNacimientoMatch[0] : '';
    let curp = curpMatch ? curpMatch[0] : '';
    let seccion = seccionMatch ? seccionMatch[0].replace(/SECCIÓN|VIGENCIA/g, '').trim() : '';
    let claveElector = claveElectorMatch ? claveElectorMatch[0] : '';
    let cp = cpMatch ? cpMatch[0] : '';
    let edoMuni = edoMuniMatch ? edoMuniMatch[0].replace(/(\d{5})\s*(.+)/g, '$2') : '';
    let calle = calleMatch ? calleMatch[0].replace(/(\d{5})/g, '') : '';

    return {
        nombre,
        genero,
        fechaNacimiento,
        curp,
        seccion,
        claveElector,
        cp,
        edoMuni,
        calle
    };
}

function convertToJSON(data) {
    let parts = data.nombre.split(' ');
    let apellidoPaterno = parts[0];
    let apellidoMaterno = parts[1];
    let nombres = parts.slice(2).join(' ');

    let edo = data.edoMuni.split(' ');
    let estado = edo.pop();
    let municipio = edo.join(' ');
    municipio = municipio.replace(/\,$/, '');

    let jsonObject = {
        "nombres": nombres,
        "apellido_paterno": apellidoPaterno,
        "apellido_materno": apellidoMaterno,
        "genero": data.genero,
        "fecha_nacimiento": data.fechaNacimiento,
        "calle": data.calle,
        "estado": estado,
        "municipio": municipio,
        "cp": data.cp,
        "curp": data.curp,
        "clave_elector": data.claveElector,
        "seccion": data.seccion,
    };

    let jsonString = JSON.stringify(jsonObject, null, 2);
    msg.innerHTML = 'Texto obtenido';
    text.value = jsonString;
}

