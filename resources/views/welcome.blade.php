<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR</title>
    <link rel="stylesheet" href="{{ asset('asset/style.css') }}">

</head>

<body>
    <div class="ocr">
        <h1>Imagen mediante OCR</h1>
        <h2 class="message"></h2>
        <span>Selecciona un archivo</span>
        <input type="file" class="file">
        <button class="btn">Hacer el OCR</button>
        <span>Texto resultante</span>
        <textarea class="text"></textarea>
    </div>

    <script src="{{ asset('asset/main.js') }}"></script>
</body>

</html>
