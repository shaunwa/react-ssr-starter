import express from 'express';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import path from 'path';
import fs from 'fs';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import App from './src/App';

global.window = {};

const app = express();

app.use(express.static('./build', { index: false }));

const articles = [
	{ title: 'Article 1', author: 'Bob' },
	{ title: 'Article 2', author: 'Betty' },
	{ title: 'Article 3', author: 'Frank' },
]

app.get('/api/articles', (req, res) => {
    console.log('Loading articles from the endpoint');
    const loadedArticles = articles; // This is where you'd load stuff from the database
    res.json(loadedArticles);
});

app.get('/*', (req, res) => {
	/* <button onClick={() => { alert('Hello!') }}>Click</button> */
	const sheet = new ServerStyleSheet();

    const app = renderToString(
		sheet.collectStyles(
			<StaticRouter location={req.url}>
				<App />
			</StaticRouter>
		)
    );

	const templateFile = path.resolve('./build/index.html');
    fs.readFile(templateFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
        }
    
		return res.send(
			data.replace(
				'<div id="root"></div>',
				`${req.url === '/articles' ? `<script>window.preloadedArticles = ${JSON.stringify(articles)}</script>` : ''}<div id="root">${app}</div>`)
				.replace('{{ styles }}', sheet.getStyleTags())
		);
    });
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});