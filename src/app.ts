import {Gtk, GLib} from './gi'
import romdb from './roms-db'

function hasDarkBackground (widget: any) {
	const style = widget.get_style_context()
	const {red, green, blue} = style.get_property("background-color", Gtk.StateFlags.NORMAL)
	const bgAvg = (red + green + blue) / 3
	return bgAvg < 0.5
}

function createLauncherButton (rom: {name: string, label: string}, onclick?: (rom: string) => void) {
	const button = new Gtk.Button({label: rom.label, hexpand: true})
	button.connect('clicked', () => {
		onclick && onclick(rom.name)
	})
	return button
}

/**
 * Create an App instance (wrapper for Gtk.Application)
 */
function App (roms: string[], title: string, subtitle?: string) {
	const application = new Gtk.Application()
	let appWindow: any

	function createHeaderBar (
		title: string, subtitle?: string //, options?: {onOpen(filename: string): void}
	) {
		const headerBar = new Gtk.HeaderBar()
		headerBar.set_title(title)
		if (subtitle != null) {
			headerBar.set_subtitle(subtitle)
		}
		headerBar.set_show_close_button(true)
		/* const button = new Gtk.Button({label: 'Open'})
		if (options && options.onOpen) {
			button.connect ('clicked', () => {
				const filename = openFileDialog(appWindow)
				if (filename != null) {
					options.onOpen(filename)
				}
			})
		}
		headerBar.pack_start(button) */
		return headerBar
	}

	function launchROM(rom: string) {
		GLib.spawn_command_line_sync('mame ' + rom)
	}

	application.connect('startup', () => {
		appWindow = new Gtk.ApplicationWindow({
			application,
			title,
			default_height: 660,
			default_width: 960,
			border_width: 0,
			window_position: Gtk.WindowPosition.CENTER
		})

		appWindow.set_titlebar(createHeaderBar(title, undefined))

		// Add container for games
		const scroll = new Gtk.ScrolledWindow({vexpand: true})
		const grid = new Gtk.Grid({column_spacing: 6, margin: 15, row_spacing: 6})
		const numCols = 6

		for (let i = 0; i < roms.length; ++i) {
			const rom = roms[i]
			grid.attach(
				createLauncherButton({name: rom, label: romdb[rom] || rom}, launchROM),
				i % numCols, Math.floor(i / numCols), 1, 1
			)
		}

		scroll.add(grid)
		appWindow.add(scroll)

		// Show the window and all child widgets
		appWindow.show_all()
	})

	application.connect('activate', () => {
		appWindow.present()
	})

	// return App interface
	return {
		run: (argv: string[]) => {
			application.run(argv)
		},
		setTitle: (title: string) => {
			appWindow.title = title
		}
	}
}

interface App extends ReturnType<typeof App> {}

export default App
