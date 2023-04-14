import { Request, Response } from "express"
import { client } from "../database"
import format from "pg-format"
import { QueryConfig, QueryResult } from "pg"
import { IProjectTechRequest, TProjectRequest } from "../interfaces/projects.interfaces"


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

const updateProject = async (req:Request, res:Response):Promise<Response> =>{
    const { body, params } = req

    const queryString: string = format(
        `
        UPDATE
            projects
        SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(body),
        Object.values(body)
    )

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[params.id]
    }

    const queryResult:QueryResult = await client.query(queryConfig)

    return res.json(queryResult.rows[0])
}

const deleteProject = async (req:Request, res:Response):Promise<Response> =>{
    const id:number = Number(req.params.id)

    const queryString:string = `
        DELETE FROM
            projects
        WHERE
            id = $1
    `

    const queryConfig:QueryConfig ={
        text:queryString,
        values:[id]
    }

    await client.query(queryConfig)

    return res.status(204).send()
}

const listProjectById = async(req:Request, res:Response):Promise<Response> =>{
    const projectId:number = Number(req.params.id)

    const queryString:string = `
         SELECT
            	p.id "projectId",
            	p."name" "projectName",
            	p.description "projectDescription",
            	p."estimatedTime" "projectEstimatedTime",
            	p.repository "projectRepository",
            	p."startDate" "projectStartDate",
            	p."endDate" "projectEndDate",
            	p."developerId" "projectDeveloperId",
            	t.id "technologyId",
            	t."name" "technologyName"
        	FROM
            	projects p
           	LEFT JOIN
           		projects_technologies pt ON p.id  = pt."projectId" 
           	LEFT JOIN 
        		technologies t ON t.id = pt."technologyId"
        	WHERE 
        		pt."projectId" = $1;
    
    `
    const queryConfig:QueryConfig = {
        text:queryString,
        values:[projectId]
    }

    const queryResult:QueryResult = await client.query(queryConfig)

    return res.json(queryResult.rows)

}

const addTechToProject = async (req:Request, res:Response):Promise<Response> =>{
    const projectId: number = Number(req.params.id)
    const tech  = req.body

    const queryStringSelect:string = 
        `
            SELECT 
                id
            FROM
                technologies
            WHERE
                name = $1
        `
    const queryConfigSelect:QueryConfig ={
        text:queryStringSelect,
        values:[tech.name]
    }
    const queryResultSelect:QueryResult = await client.query(queryConfigSelect)
    const techId = queryResultSelect.rows[0]

    if(queryResultSelect.rowCount === 0){
        return res.status(400).json({
            message: "Technology not supported.",
            options: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    }

    const queryStringCheckData:string = `
        
        	SELECT
            		*
        	FROM
            	projects_technologies
        	WHERE
            "technologyId"  = $1 AND "projectId"  = $2;
    
    `
    const queryConfigCheckData:QueryConfig = {
        text:queryStringCheckData,
        values:[techId.id, projectId]
    }

    const queryResultCheckData:QueryResult = await client.query(queryConfigCheckData)

    if(queryResultCheckData.rowCount>0){
        return res.status(409).json({
            message: "This technology is already associated with the project"
        })
    }
    
    const data:IProjectTechRequest = {
        addedIn: new Date(),
        technologyId:techId.id,
        projectId:projectId
    }

    const queryStringInsert:string = format(
        `
            INSERT INTO
                projects_technologies (%I)
            VALUES(%L)
                RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    )

    await client.query(queryStringInsert)

    const queryStringFinal:string = `
        SELECT
            	pt."technologyId" ,
            	t."name" "technologyName",
            	pt."projectId" ,
            	p."name" "projectName",
            	p.description "projectDescription",
            	p."estimatedTime" "projectEstimatedTime",
            	p.repository "projectRepository",
            	p."startDate" "projectStartDate",
            	p."endDate" "projectEndDate"
        	FROM
            	projects p
           	LEFT JOIN
           		projects_technologies pt ON p.id  = pt."projectId" 
           	LEFT JOIN 
        		technologies t ON t.id = pt."technologyId"
        	WHERE 
        		pt."projectId" = $1;
    `

    const queryConfigFinal:QueryConfig = {
        text:queryStringFinal,
        values:[projectId]
    }

    const queryResultFinal:QueryResult = await client.query(queryConfigFinal)

    return res.status(201).json(queryResultFinal.rows[0])
}

const deleteTechnology = async (req:Request, res:Response) =>{
    const {id, name} = req.params
   
    const queryStringSelect:string = 
        `
            SELECT 
                id
            FROM
                technologies
            WHERE
                name = $1
        `
    const queryConfigSelect:QueryConfig ={
        text:queryStringSelect,
        values:[name]
    }
    const queryResultSelect:QueryResult = await client.query(queryConfigSelect)
    const techId = queryResultSelect.rows[0]

    if(queryResultSelect.rowCount === 0){
        return res.status(400).json({
            message: "Technology not supported.",
            options: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    }

    const queryStringCheckName:string = `
        SELECT 
        	*
        FROM 
        	projects_technologies
        WHERE 
        	"technologyId" = $1 AND "projectId" = $2;
        `
    const queryConfigCheckName:QueryConfig = {
        text:queryStringCheckName,
        values:[techId.id, id]
    }

    const queryResultCheckName:QueryResult = await client.query(queryConfigCheckName)

    if(queryResultCheckName.rowCount === 0){
        return res.status(400).json({
            message: "Technology not related to the project."
        })
    }

     const queryString: string = `
        DELETE FROM 
            projects_technologies
        WHERE 
            "projectId" = $1 AND "technologyId" = $2;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id, techId.id],
    }

    await client.query(queryConfig)

    return res.status(204).send()
}


export { createProject, addTechToProject, updateProject, deleteProject, listProjectById, deleteTechnology }