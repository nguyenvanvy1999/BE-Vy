import { Module } from '@nestjs/common';
import { IsPasswordMediumConstraint } from './validation/request.is-password-medium.validation';
import { IsPasswordStrongConstraint } from './validation/request.is-password-strong.validation';
import { IsPasswordWeakConstraint } from './validation/request.is-password-weak.validation';
import { IsStartWithConstraint } from './validation/request.is-start-with.validation';
import { MaxGreaterThanConstraint } from './validation/request.max-greater-than.validation';
import { MaxGreaterThanEqualConstraint } from './validation/request.max-greater-than-equal.validation';
import { MinGreaterThanConstraint } from './validation/request.min-greater-than.validation';
import { MinGreaterThanEqualConstraint } from './validation/request.min-greater-than-equal.validation';
import { SkipConstraint } from './validation/request.skip.validation';

@Module({
  controllers: [],
  providers: [
    IsPasswordStrongConstraint,
    IsPasswordMediumConstraint,
    IsPasswordWeakConstraint,
    IsStartWithConstraint,
    MaxGreaterThanEqualConstraint,
    MaxGreaterThanConstraint,
    MinGreaterThanEqualConstraint,
    MinGreaterThanConstraint,
    SkipConstraint,
  ],
  imports: [],
})
export class RequestModule {}
