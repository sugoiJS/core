export class StringUtils{
    static  generateGuid() {
        function uidGenerator() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return uidGenerator() + uidGenerator() + '-' + uidGenerator() + '-' + uidGenerator() + '-' +
            uidGenerator() + '-' + uidGenerator() + uidGenerator() + uidGenerator();
    }

}