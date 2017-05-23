'use strict';


const {
	app,
	BrowserWindow,
	ipcMain
}  = require('electron');

const electronLocalshortcut = require('electron-localshortcut');
const fs = require('fs');

global.settingspath = app.getPath('home') + '/.todoconfig';
global.settingsfilepath = settingspath + '/settings.json';

if (!fs.existsSync(settingspath)){
	fs.mkdirSync(settingspath, function(error){
		if(error)
		{
			console.error('cannot create dir');
			app.quit();
		}
	});
}


app.on('ready', createWindow);
app.on('will-quit', cleanUp);
app.on('window-all-closed', function(){
	app.quit();
});
//app.on('before-quit', saveData);

let mainWindow;

function createWindow(){
	mainWindow = new BrowserWindow();
	mainWindow.maximize();
	
	mainWindow.loadURL('file://' + __dirname + '/app/main.html');
	
	electronLocalshortcut.register(mainWindow,'ctrl+S', () => {
		mainWindow.webContents.send('saveData');
	}) 
	electronLocalshortcut.register(mainWindow,'ctrl+T', () => {
		mainWindow.webContents.send('open-new-note');
	}) 
	electronLocalshortcut.register(mainWindow,'ctrl+N', () => {
		showShortcuts();
	})
//	mainWindow.webContents.openDevTools();

loadSettings();
}

function loadSettings(receiver)
{
	fs.readFile(settingsfilepath, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		else
		{
			var jsonObj = JSON.parse(data);
			global.settings = jsonObj;
			if(receiver)
			{
				receiver.send('settings-loaded');
			}
		}
	});

}

ipcMain.on('load-settings', (event, arg) => {
	loadSettings(event.sender);
});

function showShortcuts()
{
	let settingsWindow = new BrowserWindow({frame:false, parent: mainWindow, modal: true, show: false});
	settingsWindow.loadURL('file://' + __dirname + '/app/shortcuts.html');
	settingsWindow.once('ready-to-show', () => {
		settingsWindow.show()
	})
}


function cleanUp()
{
	electronLocalshortcut.unregisterAll();
}