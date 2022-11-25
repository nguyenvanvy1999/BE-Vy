import { Logger, Module } from '@nestjs/common';
import { GlobalConfigModule } from '@src/configs';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [CommandModule, GlobalConfigModule],
  providers: [, Logger],
  exports: [],
})
export class SeedModule {}
