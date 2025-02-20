const express = require('express');
const app = express();
const port = 3000; // Or any port

app.post('/test1', (req, res) => {
    console.log("Test route hit!");
    res.send("Hello from test route!");
});

app.listen(port, () => {
    console.log(`Test server listening on port ${port}`);
});