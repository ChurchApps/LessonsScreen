import axios from "axios";

interface ApiConfig {
  keyName: string;
  url: string;
  jwt: string;
  permisssions: string[];
}

class ApiHelperClass {
  public apiConfigs: ApiConfig[] = [];

  private getConfig(keyName: string): ApiConfig {
    const config = this.apiConfigs.find(c => c.keyName === keyName);
    if (!config) throw new Error(`API config not found: ${keyName}`);
    return config;
  }

  async get(path: string, keyName: string): Promise<any> {
    const config = this.getConfig(keyName);
    const response = await axios.get(config.url + path);
    return response.data;
  }

  async getAnonymous(path: string, keyName: string): Promise<any> {
    const config = this.getConfig(keyName);
    const response = await axios.get(config.url + path);
    return response.data;
  }

  async post(path: string, data: any, keyName: string): Promise<any> {
    const config = this.getConfig(keyName);
    const fullUrl = config.url + path;
    console.log("POST request to:", fullUrl);
    const response = await axios.post(fullUrl, data);
    return response.data;
  }
}

export const ApiHelper = new ApiHelperClass();
