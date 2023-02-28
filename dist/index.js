#!/usr/bin/env node
import { intro, select, isCancel, cancel, } from "@clack/prompts";
import kleur from "kleur";
import { addSupabase } from "./integrations/supabase.js";
async function main() {
    console.log();
    intro(kleur.bold().inverse(" kit-add "));
    // select integration
    const integration = await select({
        message: "Select integration, if you haven't set up a SvelteKit project already, run " +
            kleur.bold().blue("npm create svelte@latest"),
        options: [{ value: "supabase", label: "Supabase" }],
    });
    if (isCancel(integration)) {
        cancel("Operation cancelled.");
        process.exit(0);
    }
    try {
        switch (integration) {
            case "supabase":
                await addSupabase();
                break;
            default:
                break;
        }
        console.log();
        console.log();
    }
    catch (error) {
        console.log();
        console.log();
        console.log(kleur.bold().red("An error occurred:"));
        console.log();
        console.error(error);
        console.log();
        console.log();
        process.exit(0);
    }
}
main();
//# sourceMappingURL=index.js.map