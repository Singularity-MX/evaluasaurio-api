import { Module } from '@nestjs/common';

import { DepartmentsModule }
from './departments/departments.module';

@Module({
  imports: [DepartmentsModule],
})
export class AdministrationModule {}