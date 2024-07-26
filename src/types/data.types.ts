// Filter to prevent duplicates
export enum tags {
    "coding", "github"
}
export enum types {
    "tool", "website", "app"
}

export enum Roles {
    Admin = "admin",
    User = "user",
    SuperAdmin = "super_admin"
}

export interface Resources {
    id: string;
    icon: string;
    type: string;
    title: string;
    description: string;
    tags: string[];
    link: string;
    updatedAt: Date;
}

export interface CustomError {
    message: string;
    [key: string]: any;
}