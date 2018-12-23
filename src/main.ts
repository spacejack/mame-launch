import {Gio, GLib} from './gi'
import * as fs from './fs-util'
import App from './app'

// Application entry point

// Find ROMs directories (typically in ~/mame/roms)
const homeDir = GLib.get_home_dir()
const directories = fs.getDirectoryFilenames(homeDir + '/mame/roms', Gio.FileType.DIRECTORY)

// Create app instance and run
App(directories, 'Mame Launcher').run(ARGV)
