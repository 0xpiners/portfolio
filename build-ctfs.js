const fs = require('fs');
const path = require('path');

const ctfDir = path.join(__dirname, 'public', 'ctf');
const ctfs = [];

const manifestMap = {};
['picoctf-manifest.json', 'thm-manifest.json'].forEach((manifest) => {
	const manifestPath = path.join(ctfDir, manifest);
	if (fs.existsSync(manifestPath)) {
		const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
		if (data.entries) data.entries.forEach((e) => (manifestMap[e.title] = e));
	}
});

function parseDir(dir, event) {
	if (!fs.existsSync(dir)) return;
	const items = fs.readdirSync(dir, { withFileTypes: true });
	for (const item of items) {
		if (item.isDirectory()) {
			const innerPath = path.join(dir, item.name);
			const mdFiles = fs.readdirSync(innerPath).filter((f) => f.endsWith('.md'));
			if (mdFiles.length > 0) {
				const mdFile = mdFiles[0];
				const mdContent = fs.readFileSync(path.join(innerPath, mdFile), 'utf8');

				const relPath = innerPath.split('public')[1].replace(/\\/g, '/');

				let category = 'misc';
				let difficulty = 'medium';
				let tags = [event];
				let description = 'CTF Challenge from ' + event;

				if (manifestMap[item.name]) {
					const entry = manifestMap[item.name];
					category = entry.category || 'misc';
					difficulty = entry.difficulty || 'medium';
					if (entry.tags) tags = entry.tags;
					if (entry.description) description = entry.description;
				} else {
					const lowerDir = dir.toLowerCase();
					const lowerInner = innerPath.toLowerCase();
					if (lowerDir.includes('web') || lowerInner.includes('web')) category = 'web';
					else if (lowerDir.includes('pwn') || lowerDir.includes('binary') || lowerInner.includes('binary')) category = 'pwn';
					else if (lowerDir.includes('rev')) category = 'rev';
					else if (
						lowerDir.includes('crypto') ||
						lowerDir.includes('cripto') ||
						lowerInner.includes('crypto') ||
						lowerInner.includes('cripto')
					)
						category = 'crypto';
					else if (lowerDir.includes('forensics') || lowerInner.includes('forensics')) category = 'forensics';
					else if (lowerDir.includes('general') || lowerInner.includes('general')) category = 'general';

					if (category !== 'misc') tags.push(category);

					const descMatch = mdContent.match(/Description:? (.*?)(?:\n|$)/i);
					if (descMatch) description = descMatch[1].trim();
				}

				ctfs.push({
					title: item.name,
					event: event,
					category: category,
					tags: tags,
					date: manifestMap[item.name] && manifestMap[item.name].date ? manifestMap[item.name].date.substring(0, 4) : '2026',
					placement: null,
					description: description.slice(0, 150) + (description.length > 150 ? '...' : ''),
					writeup: true,
					markdownPath: `${relPath}/${mdFile}`,
				});
			} else {
				parseDir(innerPath, event); // recurse
			}
		}
	}
}

parseDir(path.join(ctfDir, 'picoCTF'), 'picoCTF');
parseDir(path.join(ctfDir, 'THM'), 'THM');
parseDir(path.join(ctfDir, 'SSoF'), 'SSoF');

// Read app.js and replace the ctfs array
const appJsPath = path.join(__dirname, 'public', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Find the ctfs array and replace it using regex
const regex = /const ctfs = \[[\s\S]*?\];\s*const CTF_BASE_ONION/;
if (regex.test(appJs)) {
	const newCtfsCode = 'const ctfs = ' + JSON.stringify(ctfs, null, '\t') + ';\n\nconst CTF_BASE_ONION';
	appJs = appJs.replace(regex, newCtfsCode);
	fs.writeFileSync(appJsPath, appJs);
	console.log(`Successfully injected ${ctfs.length} CTFs into app.js`);
} else {
	console.error('Could not find ctfs array in app.js');
}
