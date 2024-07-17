// Resources Data type
export enum tags {
    "coding", "github"
}
export enum types {
    "tool", "website", "app"
}
export enum roles {
    "admin", "user", "super_admin" 
}

export interface Resources {
    id: string;
    type: types;
    title: string;
    description: string;
    tags: tags[];
    link: string;
}


export interface CustomError {
    message: string;
    [key: string]: any;
}