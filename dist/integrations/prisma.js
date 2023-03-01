import { spinner, outro } from "@clack/prompts";
import { execa } from "execa";
import kleur from "kleur";
export async function addPrisma() {
    const s = spinner();
    s.start("Installing packages...");
    await execa("npm", ["install", "-D", "prisma"]);
    await execa("npm", ["install", "@prisma/client"]);
    s.stop("Installed " + kleur.bold().blue("prisma @prisma/client"));
    s.start("Configuring project...");
    // creates prisma/schema.prisma
    await execa("npx", ["prisma", "init"]);
    s.stop("Created " + kleur.bold().green("prisma/schema.prisma"));
    outro(kleur.bold().inverse(" Complete "));
    console.log("1. Update provider in " + kleur.bold().green("prisma/schema.prisma"));
    console.log();
    console.log("2. Update DATABASE_URL in " + kleur.bold().green(".env"));
    console.log();
    console.log("Prisma Reference: https://www.prisma.io/docs/reference");
}
//# sourceMappingURL=prisma.js.map