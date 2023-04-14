import { Request, Response } from "express";
import { IDeveloper, IListDeveloperById, TDeveloperInfoData, TDeveloperInfoRequest, TDeveloperRequest } from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (req:Request, res:Response):Promise<Response> =>{
    const developerData:TDeveloperRequest = req.body

    const queryString:string = format(
        `
            INSERT INTO
                developers(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(developerData),
        Object.values(developerData)
    )

    const queryResult:QueryResult<IDeveloper> = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])

}

const createDeveloperInfos = async (req:Request, res:Response):Promise<Response> =>{
    const developerId: number = Number(req.params.id)
    const developerInfo:TDeveloperInfoRequest = req.body

    const data: TDeveloperInfoData = {
        ...developerInfo,
        developerId
    }

    const queryString:string = format(
        `
            INSERT INTO
                developer_infos(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    )

    const queryResult:QueryResult<IDeveloper> = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])
}

const listDeveloperById = async (req:Request, res:Response):Promise<Response> =>{
    const developerId: number = Number(req.params.id)
  

    const queryString:string = 
        `
           SELECT
                "dev"."id" "developerId",
                "dev"."name" "developerName",
                "dev"."email" "developerEmail",
                "di"."developerSince" "developerInfoDeveloperSince",
                "di"."preferredOS" "developerInfoPreferredOS"
       	    FROM 
       		    developers dev
       	    LEFT JOIN
       		    developer_infos di ON di."developerId" = dev.id
            WHERE
                dev.id = $1;
        `
    const queryConfig:QueryConfig = {
        text:queryString,
        values:[developerId]
    }
    
    const queryResult:QueryResult<IListDeveloperById> = await client.query(queryConfig)

    return res.json(queryResult.rows[0])
}

const updateDeveloper = async (req:Request, res:Response):Promise<Response> =>{
    const { body, params} = req

    const queryString:string = format(
        `
            UPDATE
                developers
            SET (%I) = ROW(%L)
            WHERE
                id = $1
            RETURNING *;
        `,
        Object.keys(body),
        Object.values(body)
    )

    const queryConfig:QueryConfig ={
        text:queryString,
        values:[params.id]
    }

    const queryResult:QueryResult<IDeveloper> = await client.query(queryConfig)

    return res.json(queryResult.rows[0])
}

const deleteDeveloper = async (req:Request, res:Response):Promise<Response> =>{
    const { params } = req

    const queryString: string = `
        DELETE FROM
            developers
        WHERE 
            id = $1;
    `

    const queryConfig: QueryConfig ={
        text:queryString,
        values:[params.id]
    }

    await client.query(queryConfig)
    return res.status(204).send()
}


export { createDeveloper, createDeveloperInfos, listDeveloperById, updateDeveloper, deleteDeveloper }