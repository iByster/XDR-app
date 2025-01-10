import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './actor.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor, 'mainConnection')
    private readonly actorRepository: Repository<Actor>,
  ) {}

  async findAll(): Promise<Actor[]> {
    return this.actorRepository.find();
  }

  async findOne(id: number): Promise<Actor> {
    return this.actorRepository.findOneBy({ id });
  }

  async create(actor: Partial<Actor>): Promise<Actor> {
    const newActor = this.actorRepository.create(actor);
    return this.actorRepository.save(newActor);
  }

  async update(id: number, actor: Partial<Actor>): Promise<Actor> {
    await this.actorRepository.update(id, actor);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.actorRepository.delete(id);
  }
}
