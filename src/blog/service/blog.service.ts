import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog-entry.entity';
import { BlogEntry } from '../models/blog-entry.interface';
const slugify = require('slugify');

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private userService: UserService
    ){}

    create(user: User, blogEntry: BlogEntry): Observable<BlogEntry> {
        blogEntry.author = user;
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug: string) => {
                blogEntry.slug = slug;
                return from(this.blogRepository.save(blogEntry));
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title));
    }

    findAll(): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
            relations: ['author']
        }));
    }

    findByUser(userId: number): Observable<BlogEntry[]> {
        return from(this.blogRepository.find({
                where: {
                    author: {id: userId}
                },
                relations: ['author']
            })
        )
    }

    findOne(id: number): Observable<BlogEntry> {
        return from(
            this.blogRepository.findOne({
                where: {id: id},
                relations: ['author']
            })
        );
    }
}