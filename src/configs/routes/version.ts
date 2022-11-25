import { CustomConfigService } from '..';

const config = new CustomConfigService();

export const defaultRouteVersion = config.getString('API_VERSION', {
  defaultValue: '1',
});
