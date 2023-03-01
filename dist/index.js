#!/usr/bin/env node
import { intro, select, isCancel, cancel } from "@clack/prompts";
import kleur from "kleur";
import { addSupabase } from "./integrations/supabase.js";
import { addTailwind } from "./integrations/tailwind.js";
import { addPrisma } from "./integrations/prisma.js";
async function main() {
    console.log();
    console.log();
    intro(kleur.bold().inverse(" kit-add "));
    // select integration
    const integration = await select({
        message: "Add a SvelteKit integration:",
        options: [
            { value: "prisma", label: "Prisma", hint: "https://prisma.io" },
            {
                value: "supabase",
                label: "Supabase",
                hint: "https://supabase.com",
            },
            {
                value: "tailwind",
                label: "Tailwind CSS",
                hint: "https://tailwindcss.com",
            },
        ],
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
            case "tailwind":
                await addTailwind();
                break;
            case "prisma":
                await addPrisma();
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