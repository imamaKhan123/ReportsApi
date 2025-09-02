export default function (BaseURL: string,aerodromeId: string ) {
    const archieveApp = {
        reports: {
          getReportsForYear: `${BaseURL}v1/aerodromes/${aerodromeId}/reports/years/`,
          getReport: `${BaseURL}v1/aerodromes/${aerodromeId}/reports/by-id/`,
        },
        year: {
            getAll: `${BaseURL}v1/aerodromes/${aerodromeId}/reports/years`,
          },
      };
      
    return {archieveApp}
  }