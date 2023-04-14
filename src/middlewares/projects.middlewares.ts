import { NextFunction, Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { IDeveloper } from "../interfaces/developers.interfaces"
import { client } from "../database"

const ensureDeveloperExistsOnProject = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const { developerId } = req.body

    const queryString = `
      SELECT
            *
        FROM
            developers
        WHERE
        	id = $1;
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[developerId]
    }

    const queryResult:QueryResult<IDeveloper> = await client.query(queryConfig)
    if(queryResult.rowCount === 0){
        return res.status(404).json({
            message: "Developer not found."
        })
    }

    return next()
}

const ensureProjectExists = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const id:number = Number(req.params.id)

    const queryString = `
      SELECT
            *
        FROM
            projects
        WHERE
        	id = $1;
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[id]
    }

    const queryResult:QueryResult<IDeveloper> = await client.query(queryConfig)
    if(queryResult.rowCount === 0){
        return res.status(404).json({
            message: "Project not found."
        })
    }

    return next()
}



export { ensureDeveloperExistsOnProject, ensureProjectExists  }