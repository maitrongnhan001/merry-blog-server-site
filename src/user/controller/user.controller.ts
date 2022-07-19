import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService
    ) {}

    @Post()
    create( @Body()user: User ): Observable<User> {
        return this.userService.createUser(user);
    }

    @Get(":id")
    findOne( @Param("id")id: string ): Observable<User> {
        return this.userService.findOne(
            Number(id)
        )
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findALL();
    }

    @Delete(":id")
    deleteOne( @Param("id")id: string ): Observable<any> {
        return this.userService.deleteOne(
            Number(id)
        );
    }

    @Put(":id")
    UpdateOne( @Param("id")id: string, @Body()user: User ) {
        return this.userService.updateOne(
            Number(id), user
        );
    }

}