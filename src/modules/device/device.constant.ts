export const DEVICE_DEFAULT_SORT = 'deviceName@asc';
export const DEVICE_DEFAULT_PAGE = 1;
export const DEVICE_DEFAULT_PER_PAGE = 10;
export const DEVICE_DEFAULT_AVAILABLE_SORT = ['deviceName', 'createdAt'];
export const DEVICE_DEFAULT_AVAILABLE_SEARCH = ['deviceName'];

export enum EDeviceStatusCodeError {
  DEVICE_IS_INACTIVE_ERROR = 5500,
  DEVICE_NOT_FOUND_ERROR = 5501,
  DEVICE_EXIST_ERROR = 5502,
  DEVICE_ACTIVE_ERROR = 5503,
}
