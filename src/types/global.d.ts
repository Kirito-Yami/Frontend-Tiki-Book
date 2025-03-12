export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            fullName: string;
            email: string;
            phone: number;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }
}