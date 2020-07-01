declare interface Admin {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    createdAt: number;
    updatedAt: number;
}
