export class Settings{
    rpga={
        length: 8,
        lowerCase: true,
        upperCase: true,
        num: true,
        specialSymbol: true
    }
    duration=30
    constructor(){}

    static serialize(obj){
        return JSON.stringify(obj)
    }

    static deserialize(str){
        return JSON.parse(str)
    }
}