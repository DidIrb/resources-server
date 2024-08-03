
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


export type sitemapData = {
    title: string;
    updatedAt: Date;
}