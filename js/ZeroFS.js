class ZeroFS {
	constructor(page) {
		if(typeof page != "object" || !page instanceof ZeroPage) {
			throw new Error("page should be an instance of ZeroPage");
		}
		this.page = page;
	}

	fileExists(file) {
		if(file == "") { // root
			return Promise.resolve(true); // the following check will fail for root
		}

		let dirPath = file.split("/").slice(0, -1).join("/");
		let basePath = file.split("/").pop();

		return this.readDirectory(dirPath)
			.then(children => {
				return Promise.resolve(children.indexOf(basePath) > -1);
			});
	}
	readFile(file) {
		return this.page.cmd("fileGet", [
			file, // file
			false, // required (wait until file exists)
			"text", // text or base64
			300 // timeout
		]).then(res => {
			if(res === null || res === false) {
				return Promise.reject("File doesn't exist: " + file);
			} else {
				return Promise.resolve(res);
			}
		});
	}
	writeFile(file, content) {
		return this.page.cmd("fileWrite", [
			file, // file
			this.toBase64(content) // base64-encoded content
		]).then(res => {
			if(res === "ok") {
				return Promise.resolve(file);
			} else {
				return Promise.reject(res);
			}
		});
	}
	deleteFile(file) {
		return this.page.cmd("fileWrite", [
			file, // file
			"" // base64-encoded content
		]).then(res => {
			if(res === "ok") {
				return Promise.resolve(file);
			} else {
				return Promise.reject(res);
			}
		});
	}

	readDirectory(dir, recursive) {
		return this.page.cmd("fileList", [
			dir, // directory
		]).then(res => {
			if(recursive) {
				return res; // If recursive, return as given
			} else {
				return res.map(file => { // Otherwise, crop by "/" symbol
					if(file.indexOf("/") == -1) {
						return file;
					} else {
						return file.substr(0, file.indexOf("/"));
					}
				}).reduce((arr, cur) => { // And make them unique
					return arr.indexOf(cur) > -1 ? arr : arr.concat(cur);
				}, []);
			}
		});
	}

	toBase64(str) {
		return btoa(unescape(encodeURIComponent(str)));
	}
	fromBase64(str) {
		return decodeURIComponent(escape(atob(str)));
	}
}