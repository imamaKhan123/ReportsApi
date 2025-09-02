import generateRoutes from "./generateRoutes";
const BaseURL = "http://localhost:2080/";
const aerodromeId = 'DEMO';
const {archieveApp} = generateRoutes(BaseURL, aerodromeId);

export const environment = {
  production: true,
  api:archieveApp,
  idleTime: 6 * 60 * 60 * 1000,
  timeoutDuration: 1 * 60 * 1000,
}