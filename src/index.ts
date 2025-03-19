import { ShardingManager } from "discord.js";
import { config } from "./config";
import "./routes/index";
import path from "path";
//import { startScheduledJobs } from "./scheduler";
// DEV : const manager = new ShardingManager(path.join(__dirname, "bot.ts"), {
/// Production : const manager = new ShardingManager(path.join(__dirname, "..", "dist", "bot.js"), {
// Automatically assign shards (discord bot)
const manager = new ShardingManager(path.join(__dirname, "..", "dist", "bot.js"), {
    token: config.DISCORD_TOKEN,
    totalShards: "auto",
    execArgv: ["-r", "ts-node/register"],
});

manager.on("shardCreate", (shard) => {
    console.log(`Launched shard ${shard.id}`);
});

manager.spawn().then(() => {
    console.log("All shards launched");
    // number of shards
    console.log("Number of shards : " + manager.shards.size);

    // Start scheduled jobs
    //startScheduledJobs(manager);
});
