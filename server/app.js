import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import {
	configuredHelmet,
	httpsOnly,
	logErrors,
	pushStateRouting,
} from "./middleware";

// middleware
const app = express();
app.use(cors());
import { receiver as appA } from "./slackApp";
app.use(appA.router); //every time use first
app.use(express.json());
app.use(express.urlencoded());

// Put these statements before you define any routes.
app.use(express.static(__dirname));
const apiRoot = "/api";
const staticDir = path.join(__dirname, "static");
app.use(configuredHelmet());
app.use(morgan("dev"));

if (app.get("env") === "production") {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.use(express.static(staticDir));
app.use(pushStateRouting(apiRoot, staticDir));
app.use(logErrors());

export default app;
