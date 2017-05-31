class ZeroOptional {
	constructor(page) {
		if(typeof page != "object" || !page instanceof ZeroPage) {
			throw new Error("page should be an instance of ZeroPage");
		}
		this.page = page;
	}

	getFileList(directory, recursive) {
		return this.page.cmd("optionalFileList", [
			undefined,
			"time_downloaded DESC",
			100000
		]).then(files => {
			files = files
				.map(file => {
					if(file.inner_path.substr(0, directory.length + 1) == directory + "/") {
						file.inner_path = file.inner_path.substr(directory.length + 1);
						return file;
					} else if(directory == "") {
						return file;
					} else {
						return null;
					}
				})
				.filter(file => file);

			if(!recursive) {
				files = files
					.map(file => {
						let pos = file.inner_path.indexOf("/")
						if(pos != -1) {
							file.inner_path = file.inner_path.substr(0, pos);
						}
						return file;
					})
					.reduce((arr, cur) => {
						return arr.find(a => a.inner_path == cur.inner_path) ? arr : arr.concat(cur);
					}, [])
					.sort((a, b) => a.inner_path.localeCompare(b.inner_path));
			}

			return files
				.map(file => {
					return {
						path: file.inner_path,
						downloaded: !!file.is_downloaded,
						pinned: !!file.is_pinned
					};
				});
		});
	}
};