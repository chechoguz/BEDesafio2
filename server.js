const cors = require('cors');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// GET /canciones
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    res.json(canciones);
});

// POST /canciones
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    canciones.push(nuevaCancion);
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
    res.status(201).send('Canción agregada al repertorio.');
});

// PUT /canciones/
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    const index = canciones.findIndex(c => c.id == id);

    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...req.body };
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
        res.send('Canción actualizada.');
    } else {
        res.status(404).send('Canción no encontrada.');
    }
});

// DELETE /canciones/
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;
    let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    const nuevaLista = canciones.filter(c => c.id != id);

    if (canciones.length !== nuevaLista.length) {
        fs.writeFileSync('repertorio.json', JSON.stringify(nuevaLista, null, 2));
        res.send('Canción eliminada.');
    } else {
        res.status(404).send('Canción no encontrada.');
    }
});
