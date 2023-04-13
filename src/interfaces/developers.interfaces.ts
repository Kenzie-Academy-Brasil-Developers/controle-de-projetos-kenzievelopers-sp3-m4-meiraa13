interface IDeveloper {
    id: number,
    name:string,
    email:string
}

type TDeveloperRequest = Omit<IDeveloper, 'id'>

interface IDeveloperInfo{
    id:number,
    developerSince: Date,
    preferredOS: 'Windows' | 'MacOS' | 'Linux',
    developerId: number
}

type TDeveloperInfoRequest = Omit<IDeveloperInfo,'id' | 'developerId'>

type TDeveloperInfoData = Omit<IDeveloperInfo,'id' >

interface IListDeveloperById{
    developerId:number,
    developerName:string,
    developerEmail:string,
    developerInfoDeveloperSince: Date | null,
    developerInfoPreferredOS: string | null
}

export { IDeveloper, TDeveloperRequest, IDeveloperInfo, TDeveloperInfoRequest, TDeveloperInfoData, IListDeveloperById }