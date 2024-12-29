import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { EditSensorDto } from './dto/edit-sensor.dto';
import { SensorsService } from './sensor.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get('types')
  getSensorTypes() {
    return this.sensorsService.getSensorTypes();
  }

  @Post()
  createSensor(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorsService.createSensor(createSensorDto);
  }

  @Get()
  getAllSensors() {
    return this.sensorsService.getAllSensors();
  }

  @Get(':id')
  getSensorById(@Param('id') id: number) {
    return this.sensorsService.getSensorById(id);
  }

  @Put(':id')
  editSensor(@Param('id') id: number, @Body() editSensorDto: EditSensorDto) {
    return this.sensorsService.editSensor(id, editSensorDto);
  }

  @Delete(':id')
  deleteSensor(@Param('id') id: number) {
    return this.sensorsService.deleteSensor(id);
  }

  @Post(':id/trigger')
  async triggerSensor(@Param('id') id: number) {
    return this.sensorsService.triggerSensor(id);
  }
}
