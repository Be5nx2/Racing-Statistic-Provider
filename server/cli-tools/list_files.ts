import { listFiles } from "../src/library/directory";
import { logger } from "../src/library/tools";

function main(): void {
    logger.info("Listing files in ./input");
    const files = listFiles("./input");
    console.log(files.join("\n"));
}

main();