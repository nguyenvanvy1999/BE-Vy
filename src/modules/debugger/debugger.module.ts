import { Global, Module } from '@nestjs/common';

import { DebuggerOptionService } from './services/debugger.option.service';
import { DebuggerService } from './services/debugger.service';

@Global()
@Module({
  providers: [DebuggerOptionService, DebuggerService],
  exports: [DebuggerOptionService, DebuggerService],
  imports: [],
})
export class DebuggerModule {}
