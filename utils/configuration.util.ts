class ConfigurationHandler{
    private static __configurations = {};

    static getConfiguration<T = any>(type?: ConfigurationTypes | string, fallbackConfiguration?: any): T{
        if(!type){
            return this.__configurations as any;
        }
        return this.__configurations[type] || fallbackConfiguration;
    }

    static setConfiguration(configuration: any = {}){
        this.__configurations = configuration;
    }
}

export function getConfiguration<T = any>(type?: ConfigurationTypes | string, fallbackConfiguration?: any){
   return ConfigurationHandler.getConfiguration<T>(type, fallbackConfiguration);
}

export function setConfiguration(configuration: any){
    return ConfigurationHandler.setConfiguration(configuration);
 }

export enum ConfigurationTypes {
    security = 'security',
    ssl = 'ssl'
}