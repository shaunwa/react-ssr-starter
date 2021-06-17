import express from 'express';
import path from 'path';
import fs from 'fs';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './src/App';

const app = express();

app.get('/*', (req, res) => {
    const app = renderToString(
		<h1>Hello from the Server Side!</h1>
    );

	return res.send(
	`<html>
		<body>
			<div id="root">${app}</div>
		</body>
	</html>`
	);
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});