import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './resource.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource, 'mainConnection')
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async findAll(): Promise<Resource[]> {
    return this.resourceRepository.find();
  }

  async findOne(id: number): Promise<Resource> {
    return this.resourceRepository.findOneBy({ id });
  }

  async create(resource: Partial<Resource>): Promise<Resource> {
    const newResource = this.resourceRepository.create(resource);
    return this.resourceRepository.save(newResource);
  }

  async update(id: number, resource: Partial<Resource>): Promise<Resource> {
    await this.resourceRepository.update(id, resource);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.resourceRepository.delete(id);
  }
}
