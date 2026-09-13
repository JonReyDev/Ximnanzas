import app from './app.js';

const port = Number(process.env.PORT ?? 5000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT ?? ''}"`);
}

app.listen(port, () => {
  console.info(`XIMNANZAS API listening on port ${port}`);
});
