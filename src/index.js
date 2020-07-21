import app from './app';

app.listen(5000, () => {
  // GET / --> sanity endpoint
  app.get('/', (req, res) => {
    // montando una ruta en la raiz
    // req, informacion que se envia
    // res, informacion que se recibe
    res.send('Funcionando');
    res.end();
  });

  console.log('Listening on port 5000!');
});
