import express from 'express';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import path from 'path';
import fs from 'fs';
import { renderToString } from 'react-dom/server';
import App from './src/App';

const app = express();

app.use(express.static('./build', { index: false }));

app.get('/*', (req, res) => {
	/* <button onClick={() => { alert('Hello!') }}>Click</button> */

    const app = renderToString(
		<StaticRouter>
			<App />
		</StaticRouter>
    );

	const templateFile = path.resolve('./build/index.html');
    fs.readFile(templateFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
        }
    
		return res.send(
			data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
		);
    });
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});