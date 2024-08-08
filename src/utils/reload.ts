// reload.ts
import axios from 'axios';
import { env } from '../config/auth.config';

const url  = env.BACKEND_URL as string;


export function reloadWebsite(): void {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}
