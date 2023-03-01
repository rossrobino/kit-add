import { spinner, outro } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs";
import kleur from "kleur";

export async function addTailwind() {
	// start spinner
	const s = spinner();
	s.start("Installing packages...");

	await execa("npm", [
		"install",
		"-D",
		"tailwindcss",
		"postcss",
		"autoprefixer",
	]);

	s.stop("Installed " + kleur.bold().blue("tailwindcss postcss autoprefixer"));

	s.start("Configuring project...");

	const tailwindConfig = fs.readFileSync(
		new URL(`../assets/tailwind/tailwind.config.cjs`, import.meta.url),
		"utf-8",
	);

	fs.appendFile(`tailwind.config.cjs`, tailwindConfig, (error) => {
		if (error) console.error(error);
	});

	const appCss = fs.readFileSync(
		new URL(`../assets/tailwind/app.css`, import.meta.url),
		"utf-8",
	);

	fs.appendFile(`src/app.css`, appCss, (error) => {
		if (error) console.error(error);
	});

	s.stop("Created " + kleur.bold().green("tailwind.config.cjs src/app.css"));

	// prettier
	const prettier = fs.existsSync(".prettierrc");

	if (prettier) {
		s.start("Configuring prettier...");

		// add plugin to .prettierrc
		const prettierrcFile = fs.readFileSync(".prettierrc", "utf-8");
		const prettierrc = JSON.parse(prettierrcFile);
		prettierrc.plugins.push("prettier-plugin-tailwindcss");
		fs.writeFileSync(".prettierrc", JSON.stringify(prettierrc, null, 4));

		// install prettier-plugin-tailwindcss
		await execa("npm", ["install", "-D", "prettier-plugin-tailwindcss"]);

		s.stop(
			"Installed " +
				kleur.bold().blue("prettier-plugin-tailwindcss") +
				", added to " +
				kleur.bold().green(".prettierrc"),
		);
	}

	outro(kleur.bold().inverse(" Complete "));


	console.log(
		"1. " +
			kleur.bold().red('import "../app.css";') +
			" in " +
			kleur.bold().green("src/routes/+layout.svelte"),
	);
}
