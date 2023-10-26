import { Injectable } from "@nestjs/common";
import { IUser } from "../interfaces/user.interface";

@Injectable()
export class UserRepository {
    private users: IUser[] = [
        {id: 1, email: 'admin@gmail.com', password: '$2b$05$bE25IR1ag8VEG1JQUQch6elHGBRzl.LBYku1wXVoQ6JwGscL5Dzne'}, // password: admin
        {id: 2, email: 'test@gmail.com', password: '$2b$05$maY4D9oxyrb7Kv4oisTjXe9XQkaguWt7ql8ZSSvRBXM8DNLtJzGT.'} // password: test
    ];

    findAll(): IUser[] {
        return this.users;
    }

    findById(id: number): IUser {
        return this.users.find(u => u.id === id);
    }

    findByEmail(email: string): IUser {
        return this.users.find(u => u.email === email);
    }

    update(id: number, updatedUser: IUser): IUser | undefined {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return undefined;
        this.users[index] = { ...this.users[index], ...updatedUser };
        return this.users[index];
    }

    delete(id: number): IUser | undefined {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return undefined;
        const deletedUser = this.users.splice(index, 1)[0];
        return deletedUser;
    }

    create(email: string, password: string): IUser {
        const newUser: IUser = {
            id: this.users[this.users.length - 1].id + 1 | 1,
            email,
            password
        }
        this.users.push(newUser)
        return newUser;
    }
}