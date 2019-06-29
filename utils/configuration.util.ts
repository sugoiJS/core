class ConfigurationHandler{
    private static __configurations = {};

    static getConfiguration(type?: ConfigurationTypes, fallbackConfiguration?: any){
        if(!type){
            return this.__configurations;
        }
        return this.__configurations[type] || fallbackConfiguration;
    }

    static setConfiguration(configuration: any = {}){
        this.__configurations = configuration;
    }
}

export function getConfiguration(type?: ConfigurationTypes, fallbackConfiguration?: any){
   return ConfigurationHandler.getConfiguration(type, fallbackConfiguration);
}

export function setConfiguration(configuration: any){
    return ConfigurationHandler.setConfiguration(configuration);
 }

export enum ConfigurationTypes {
    security = 'security',
    ssl = 'ssl'
}