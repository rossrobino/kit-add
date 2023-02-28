#! /usr/bin/env node
import { confirm, select, spinner, outro, isCancel, cancel, } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs";
import kleur from "kleur";
export async function addSupabase() {
    // language
    const language = await select({
        message: "Use JavaScript or TypeScript:",
        options: [
            { value: "ts", label: "TypeScript" },
            { value: "js", label: "JavaScript" },
        ],
    });
    if (isCancel(language)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }
    // auth
    const auth = await confirm({
        message: "Do you want to use Supabase for Authentication?",
    });
    if (isCancel(auth)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }
    let layout = false;
    if (auth) {
        // layout
        layout = await confirm({
            message: "Do you want to initialize " +
                kleur
                    .bold()
                    .green("src/routes/+layout.svelte, src/routes/+layout, src/routes/+layout.server") +
                "?",
        });
        if (isCancel(layout)) {
            cancel("Operation cancelled.");
            process.exit(0);
        }
    }
    // start spinner
    const s = spinner();
    s.start("Configuring project...");
    // install @supabase/supabase-js or @supabase/auth-helpers-sveltekit
    if (!auth) {
        await execa("npm", ["install", "@supabase/supabase-js"]);
    }
    else {
        await execa("npm", ["install", "@supabase/auth-helpers-sveltekit"]);
    }
    // create folders
    const dbFolder = "src/lib/db";
    if (!fs.existsSync(dbFolder)) {
        fs.mkdirSync(dbFolder, { recursive: true });
    }
    if (layout) {
        if (!fs.existsSync("src/routes")) {
            fs.mkdirSync("src/routes", { recursive: true });
        }
    }
    // create client
    const client = fs.readFileSync(new URL(`../assets/supabase/client${auth ? "Auth" : ""}.${language}`, import.meta.url), "utf-8");
    fs.appendFile(`${dbFolder}/client.${language}`, client, (error) => {
        if (error)
            console.error(error);
    });
    // add hooks
    if (auth) {
        fs.appendFile(`src/hooks.client.${language}`, `import "$lib/db/client"`, (error) => {
            if (error)
                console.error(error);
        });
        fs.appendFile(`src/hooks.server.${language}`, `import "$lib/db/client"`, (error) => {
            if (error)
                console.error(error);
        });
        if (layout) {
            // +layout.svelte
            const layoutSvelte = fs.readFileSync(new URL(`../assets/supabase/layout${language}.svelte`, import.meta.url), "utf-8");
            fs.appendFile(`src/routes/+layout.svelte`, layoutSvelte, (error) => {
                if (error)
                    console.error(error);
            });
            // +layout
            const layoutClient = fs.readFileSync(new URL(`../assets/supabase/layout.${language}`, import.meta.url), "utf-8");
            fs.appendFile(`src/routes/+layout.${language}`, layoutClient, (error) => {
                if (error)
                    console.error(error);
            });
            // +layout.server
            const layoutServer = fs.readFileSync(new URL(`../assets/supabase/layout.server.${language}`, import.meta.url), "utf-8");
            fs.appendFile(`src/routes/+layout.server.${language}`, layoutServer, (error) => {
                if (error)
                    console.error(error);
            });
        }
    }
    // create .env file - user must manually add keys later
    const environment = fs.readFileSync(new URL("../assets/supabase/environment.txt", import.meta.url), "utf-8");
    fs.appendFile(".env", environment, (error) => {
        if (error)
            console.error(error);
    });
    s.stop("Installed " +
        kleur
            .bold()
            .blue(auth ? "@supabase/auth-helpers-sveltekit" : "@supabase/supabase-js") +
        ", created " +
        kleur
            .bold()
            .green(`${dbFolder}/client, ${auth ? "src/hooks.client, src/hooks.server" : ""}`) +
        kleur.bold().green(".env"));
    if (language === "ts") {
        s.start("Configuring types...");
        await execa("npm", ["install", "-D", "supabase"]);
        const pack = fs.readFileSync("package.json", "utf-8");
        const packJson = JSON.parse(pack);
        packJson.scripts["update-types"] = `npx supabase gen types typescript --project-id "PROJECT_ID" --schema public > ${dbFolder}/types.ts`;
        fs.writeFileSync("package.json", JSON.stringify(packJson, null, 4));
        s.stop("Installed " +
            kleur.bold().blue("supabase") +
            " as a dev dependency, added " +
            kleur.bold().green("update-types") +
            " script to " +
            kleur.bold().green("package.json"));
    }
    outro(kleur.bold().inverse(" Next steps "));
    console.log("1. Update environment variables in " + kleur.bold().green(".env"));
    if (language === "ts") {
        console.log();
        console.log('2. Update "PROJECT_ID" in the ' +
            kleur.bold().green("update-types") +
            " script in " +
            kleur.bold().green("package.json") +
            " (contained in PUBLIC_SUPABASE_URL)");
        console.log();
        console.log("3. Run " + kleur.bold().blue("npx supabase login"));
        console.log();
        console.log("4. Run " +
            kleur.bold().blue("npm run update-types") +
            " to generate or update " +
            kleur.bold().green("src/lib/db/types.ts") +
            " each time the schema is updated");
    }
}
//# sourceMappingURL=supabase.js.map