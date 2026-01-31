import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS = 'allowAnonymous';

export const Anonymous = () => SetMetadata(ALLOW_ANONYMOUS, true);
