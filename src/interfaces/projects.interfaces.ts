interface IProject {
    id:number,
    name:string,
    description:string,
    estimatedTime:string,
    repository:string,
    startDate: Date,
    endDate: Date | null,
    developerId: number
}

interface IProjectTechRequest {
    addedIn:Date,
    technologyId:number,
    projectId:number
}

type TProjectRequest = Omit<IProject, 'id'>


export {IProject, IProjectTechRequest, TProjectRequest }