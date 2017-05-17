class Files {
	constructor(fs) {
		this.fs = fs;
		this.shownPathDelim = " " + String.fromCharCode(8250) + " "; /* right arrow */
		this.root = "files";
		this.showRoot = "Root";
	}

	load(path) {
		document.getElementById("path").textContent = (
			(this.showRoot ? [this.showRoot] : [])
				.concat(path ? path.split("/") : []).join(this.shownPathDelim)
		);
	}
};

/*
<div class="file">
	<div class="file-icon-container">
		<img class="file-icon" src="img/file/text.png">
	</div>

	<a class="file-name" href="fsdgfdg">fsdgfdg</a>
</div>
<div class="file">
	<div class="file-icon-container">
		<img class="file-icon" src="img/file/image.png">
	</div>

	<a class="file-name" href="fsdgfdg">fsdgfdg</a>
</div>
*/