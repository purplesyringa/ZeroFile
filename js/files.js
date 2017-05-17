class Files {
	constructor(fs) {
		this.fs = fs;
		this.shownPathDelim = " " + String.fromCharCode(8250) + " "; /* right arrow */
		this.root = "files";
		this.showRoot = "Root";

		this.types = {
			image: [
				"jpg", // JPEG
				"jpeg",
				"jp2", // JPEG 200
				"jpx",
				"tiff", // Tiff
				"gif", // GIF
				"bmp", // BMP
				"png", // PNG
				"webp", // WebP
				"bpg", // Better Portable Graphics
				"svg" // SVG
			],
			music: [
				"3gp", // 3GP
				"aiff", // AIFF
				"au", // Au
				"flac", // Flac
				"gsm", // GSM
				"m4a", // M4A
				"mp3", // MP3
				"ogg", // Ogg
				"oga",
				"mogg",
				"vox", // vox
				"wav", // WAV
				"wma" // WMA
			],
			video: [
				"mkv", // MKV
				"ogv", // Ogg
				"avi", // AVI
				"mov", // MOV
				"wmv", // WMV
				"mp4", // MP4
				"mpg", // MPEG
				"mpeg",
				"m4v" // M4V
			],
			text: [
				"doc", // Doc
				"docx",
				"latex", // LaTeX
				"tex",
				"text", // TXT
				"txt"
			]
		};
	}

	guessType(file) {
		return this.fs.getType(file)
			.then(type => {
				if(type == "dir") {
					return "dir";
				}

				let filename = file.split("/").slice(-1)[0].split(".");

				let ext;
				if(filename.length == 1) {
					ext = "";
				} else {
					ext = filename[filename.length - 1].toLowerCase();
				}

				return Object.keys(this.types).find(type => this.types[type].indexOf(ext) > -1) || "file";
			});
	}
	getFiles(path) {
		if(this.root) {
			if(path) {
				path = this.root + "/" + path;
			} else {
				path = this.root;
			}
		}

		return this.fs.readDirectory(path)
			.then(files => {
				files = files.filter(file => {
					return file[0] != ".";
				});

				return ZeroPage.async.map(files, file => {
					return this.guessType((path ? path + "/" : "") + file)
						.then(type => {
							return {
								type: type,
								name: file
							};
						});
				});
			});
	}

	load(path) {
		document.getElementById("path").textContent = (
			(this.showRoot ? [this.showRoot] : [])
				.concat(path ? path.split("/") : []).join(this.shownPathDelim)
		);

		return this.getFiles(path)
			.then(files => {
				let filesNode = document.getElementById("files");
				filesNode.innerHTML = "";

				files.forEach(file => {
					let fileNode = document.createElement("a");
					fileNode.className = "file" + (file.type == "dir" ? " file-dir" : "");
					fileNode.href = "?" + (path ? path + "/" : "") + file.name;

					let fileIconContainer = document.createElement("div");
					fileIconContainer.className = "file-icon-container";
					let fileIcon = document.createElement("img");
					fileIcon.className = "file-icon";
					fileIcon.src = "img/file/" + file.type + ".png";
					fileIconContainer.appendChild(fileIcon);
					fileNode.appendChild(fileIconContainer);

					let link = document.createElement("span");
					link.className = "file-name";
					link.textContent = file.name;
					fileNode.appendChild(link);

					filesNode.appendChild(fileNode);
				});
			});
	}
};