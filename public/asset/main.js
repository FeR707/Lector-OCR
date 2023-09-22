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
                            name: fileInput.files[0].name
                        })
                    })


                    .then(res => res.text())
                    .then(data => {

                        // usar expresion regular para quitar los saltos de linea
                        // let text = data.replace(/(\r\n|\n|\r)/gm, "");

                        // Expresion regular nombre
                        let name = data.match(/(NOMBRE)[\s]([A-Z]+\s[A-Z]+(\s(?:(?!DOMICILIO)[A-Z])+){1,2})/g)[0];
                        // Eliminar "NOMBRE" y "DOMICILIO" y conservar solo el nombre
                        name = name.replace(/NOMBRE|DOMICILIO/g, '').trim();
                        name = name.replace(/\s+/g, ' ');

                        //Expresion regular GENERO/SEXO 
                        let genero = data.match(/(SEXO)[\s]([HM])/g)[0];
                        genero = genero.replace(/SEXO/g, '').trim();

                        // Expresion regular FECHA DE NACIMIENTO
                        let fechaNacimiento = data.match(/(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/]\d{4}/g)[0];

                        // Expresion regular CURP
                        let curp = data.match(/([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)/g)[0];

                        // Expresion regular SECCION
                        let seccion = data.match(/(SECCIÓN)[\s]([0-9]{4}|(VIGENCIA)\s[0-9]{4})/g)[0];
                        seccion = seccion.replace(/SECCIÓN|VIGENCIA/g, '').trim();

                        // Expresion regular CLAVE DE ELECTOR
                        let claveElector = data.match(/[A-Z]{6}[0-9]{8}[HM][0-9]{3}/g)[0];

                        // Expresion regular DOMICILIO
                        let domicilio = data.match(/(DOMICILIO)([\s\S]*?)(CLAVE DE ELECTOR)/g)[0];
                        domicilio = domicilio.replace(/DOMICILIO|CLAVE DE ELECTOR/g, '').trim();
                        domicilio = domicilio.replace(/\s+/g, ' ');

                        convertToJSON(name, genero, fechaNacimiento, curp, seccion, claveElector, domicilio);
                    });

            }
        })

        function convertToJSON(name, genero, fechaNacimiento, curp, seccion, claveElector, domicilio) {
            let parts = name.split(' ');
            let apellidoPaterno = parts[0];
            let apellidoMaterno = parts[1];
            let nombre = parts.slice(2).join(' ');

            let partsD = domicilio.split(' ');
            let estado = partsD.pop().replace(/\.$/, '');
            let domicilioL = partsD.join(' ');

            let partM = domicilioL.split(' ');
            let municipio = partM.pop().replace(/\,$/, '');
            let domicilioC = partM.join(' ');

            let partC = domicilioC.split(' ');
            let cp = partC.pop();
            let domicilioCalle = partC.join(' ');

            let jsonObject = {
                "nombre": nombre,
                "apellido_paterno": apellidoPaterno,
                "apellido_materno": apellidoMaterno,
                "genero": genero,
                "fecha_nacimiento": fechaNacimiento,
                "calle": domicilioCalle,
                "estado": estado,
                "municipio": municipio,
                "cp": cp,
                "curp": curp,
                "clave_elector": claveElector,
                "seccion": seccion,
            };

            // Convertir el objeto JavaScript en una cadena JSON
            let jsonString = JSON.stringify(jsonObject, null, 2);
            msg.innerHTML = 'Texto obtenido';
            // Mostrar la cadena JSON en el textarea correspondiente
            text.value = jsonString;
        }
        // ejemplo de una funcion en jQuery donde retorne un json con los datos obtenidos
        // function convertToJSON(name, genero, fechaNacimiento, curp, seccion, claveElector, domicilio) {
        //     let jsonObject = {
        //         "nombre": name,
        //         "genero": genero,
        //         "fechaNacimiento": fechaNacimiento,
        //         "curp": curp,
        //         "seccion": seccion,
        //         "claveElector": claveElector,
        //         "domicilio": domicilio
        //     };
        //     return jsonObject;
        // }
