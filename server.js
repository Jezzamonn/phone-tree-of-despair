const { app, supportedPaths } = require('./app.js');

const port = process.env.PORT || 3000;

// Log the supported endpoints
console.log('Supported paths:');
for (const path of supportedPaths) {
    console.log(`  ${path}`);
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
