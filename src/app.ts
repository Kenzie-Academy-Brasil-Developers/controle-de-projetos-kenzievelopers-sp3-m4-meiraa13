import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, listDeveloperById, updateDeveloper, } from "./logics/developers.logics";
import { ensureDeveloperExists, ensureDeveloperHasInfo, ensureDeveloperOSisRight, verifyEmailExists } from "./middlewares/developers.middlewares";
import { addTechToProject, createProject, deleteProject, deleteTechnology, listProjectById, updateProject } from "./logics/projects.logics";
import { ensureDeveloperExistsOnProject, ensureProjectExists } from "./middlewares/projects.middlewares";


const app: Application = express();
app.use(express.json())

app.post('/developers',verifyEmailExists, createDeveloper)
app.post('/developers/:id/infos',ensureDeveloperExists,ensureDeveloperHasInfo, ensureDeveloperOSisRight ,createDeveloperInfos)
app.get('/developers/:id', ensureDeveloperExists ,listDeveloperById)
app.patch('/developers/:id', ensureDeveloperExists, verifyEmailExists, updateDeveloper)
app.delete('/developers/:id',ensureDeveloperExists, deleteDeveloper)

app.post('/projects',ensureDeveloperExistsOnProject, createProject)
app.get('/projects/:id', ensureProjectExists ,listProjectById)
app.patch('/projects/:id',ensureProjectExists, ensureDeveloperExistsOnProject,updateProject)
app.delete('/projects/:id', ensureProjectExists ,deleteProject)
app.post('/projects/:id/technologies',ensureProjectExists , addTechToProject) 
app.delete('/projects/:id/technologies/:name', ensureProjectExists, deleteTechnology)


export default app;
