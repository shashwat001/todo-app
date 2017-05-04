'use strict';

const {
	app,
	BrowserWindow
}  = require('electron');

app.on('ready', createWindow);

let mainWindow;

function createWindow(){
	mainWindow = new BrowserWindow({width: 800, height:600});
	mainWindow.loadURL('file://' + __dirname + '/app/main.html');
	mainWindow.webContents.openDevTools();
}