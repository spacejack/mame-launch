import {Gio} from './gi'

export function getDirectoryFilenames (path: string, type?: number) {
	const filenames = []
	const dir = Gio.File.new_for_path(path)
	const fileEnum = dir.enumerate_children(
		'standard::name,standard::type',
		Gio.FileQueryInfoFlags.NONE, null
	)
	let info
	while ((info = fileEnum.next_file(null))) { // tslint:disable-line no-conditional-assignment
		const ftype = info.get_file_type()
		if (type == null || ftype === type) { // Gio.FILE_TYPE_DIRECTORY etc.
			filenames.push(info.get_name())
		}
	}
	return filenames
}
