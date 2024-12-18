import { API_CONFIG } from '../../config/api';
import { fetchWithRetry } from '../../utils/network';
import { ZillowApiResponse, ZillowPhoto } from '../../types/zillow';

export async function fetchZillowData(zpid: string): Promise<ZillowApiResponse> {
  const apiUrl = `${API_CONFIG.ZILLOW.API_URL}/${zpid}`;
  
  const response = await fetchWithRetry(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': API_CONFIG.ZILLOW.USER_AGENT
    }
  });

  return response.json();
}