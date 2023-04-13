import { NextFunction, Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { client } from "../database"
import { IDeveloper, TDeveloperInfoData, TDeveloperInfoRequest } from "../interfaces/developers.interfaces"
import format from "pg-format"


const verifyEmailExists = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const email = req.body.email

    const queryString = `
        SELECT
            *
        FROM
            developers
        WHERE 
            email = $1
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[email]
    }

    const queryResult:QueryResult = await client.query(queryConfig)

    if (queryResult.rowCount > 0){
        return res.status(409).json({
            message: "Email already exists."
        })
    }

    return next()
}

const ensureDeveloperHasInfo  = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const developerId: number = Number(req.params.id)

    const queryString = `
      SELECT
            *
        FROM
            developer_infos
        WHERE
        	"developerId" = $1;
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[developerId]
    }

    const queryResult:QueryResult<IDeveloper> = await client.query(queryConfig)
    if(queryResult.rowCount > 0){
        return res.status(409).json({
            message: "Developer infos already exists."
        })
    }

    return next()
}

const ensureDeveloperOSisRight  = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const developerInfo:TDeveloperInfoRequest = req.body

    if(!['Windows', 'Linux', 'MacOS'].includes(developerInfo.preferredOS)){
        return res.status(400).json({
            message: 'Invalid OS option.',
            options: ['Windows', 'Linux', 'MacOS']
        })

    }
    
    return next()
}

const ensureDeveloperExists  = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const developerId: number = Number(req.params.id)

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

export { verifyEmailExists, ensureDeveloperHasInfo, ensureDeveloperOSisRight, ensureDeveloperExists }