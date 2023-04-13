import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, listDeveloperById, updateDeveloper, } from "./logics/developers.logics";
import { ensureDeveloperExists, ensureDeveloperHasInfo, ensureDeveloperOSisRight, verifyEmailExists } from "./middlewares/developers.middlewares";
import { createProject } from "./logics/projects.logics";

const app: Application = express();
app.use(express.json())

app.post('/developers',verifyEmailExists, createDeveloper)
app.post('/developers/:id/infos',ensureDeveloperExists,ensureDeveloperHasInfo, ensureDeveloperOSisRight ,createDeveloperInfos)
app.get('/developers/:id', ensureDeveloperExists ,listDeveloperById)
app.patch('/developers/:id', ensureDeveloperExists, verifyEmailExists, updateDeveloper)
app.delete('/developers/:id',ensureDeveloperExists, deleteDeveloper)

app.post('/projects', createProject)
app.get('/projects/:id')
app.patch('/projects/:id')
app.delete('/projects/:id')
app.post('/projects/:id/technologies')
app.delete('/projects/:id/technologies/:name')


export default app;
