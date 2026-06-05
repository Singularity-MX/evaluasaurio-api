import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

import { DepartmentsModule }
from './departments/departments.module';

@Module({
  imports: [DepartmentsModule, UsersModule],
})
export class AdministrationModule {}