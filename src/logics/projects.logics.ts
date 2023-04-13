import { Request, Response } from "express"
import { client } from "../database"
import format from "pg-format"
import { QueryResult } from "pg"
import { TProjectRequest } from "../interfaces/projects.interfaces"


const createProject = async (req:Request, res:Response):Promise<Response> =>{
    const projectData:TProjectRequest = req.body

    const queryString:string = format(
        `
            INSERT INTO
                projects(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(projectData),
        Object.values(projectData)
    )

    const queryResult:QueryResult = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])

}


export { createProject }