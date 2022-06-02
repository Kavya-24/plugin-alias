const os = require('os');
const { args,flags } = require('@oclif/command');
const { BaseCommand, TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const fs = require('fs');



class Delete extends BaseCommand {

  constructor(argv, config) {
    super(argv, config);
  }

  async run() {
    await super.run();

    const {args} = this.parse(Delete)
    
    if(this.validateArguments(args)){

        const userAlias = args["name"];
        const aliasFilePath = this.getAliasFilePath();

        if(fs.existsSync(aliasFilePath)){     

          this.removeAlias(userAlias, aliasFilePath);

        }

        else{

          console.log('please run alias: setup command first to initiate the plugin setup')

        }


    }
    
    

    

  }

  removeAlias(userAlias, aliasFilePath){

      //We have valid arguments and the aliasFilePath exists
      const file_data = fs.readFileSync(aliasFilePath, 'utf-8');
      
      try{
      
        const json_data = JSON.parse(file_data);
        const exist_util = this.findAlias(userAlias, json_data);
        const alias_exists = exist_util["exist"];
        const alias_at = exist_util["index"]; 
        
        
        if(!alias_exists){

          console.log('alias does not exist');
        }
        
        else{
            json_data["aliases"].splice(alias_at, 1);
            
        }

    
      
        this.insertInFile(aliasFilePath, json_data);
      
      } catch(err){
        console.log(err);
        console.log('unable to parse');
      }
      
      

      
      

  }

  insertInFile(aliasFilePath, json_data){

      
      fs.appendFileSync(aliasFilePath,
                        JSON.stringify(json_data),
                        { encoding: "utf8", flag: "w" }
                      );


        return;
  }


  findAlias(userAlias, json_data){


      for (let i = 0; i < json_data["aliases"].length; i++) {
        
        if(json_data["aliases"][i]["name"] == userAlias){
          return {"exist": true, "index": i};;
        }
      }

      return {"exist": false, "index": -1};
  }

  getAliasFilePath(){

    const dataDirectory = this.config.dataDir;
    const aliasFolderName = 'alias';
    const aliasFolderPath =  dataDirectory + '/' + aliasFolderName;
    const aliasFileName = 'data.json';
    return aliasFolderPath + '/' + aliasFileName;

  }

  validateArguments(args){

    var isValid = true;
    var userAlias = '';

    try{
        userAlias = args["name"];
    } catch(err){
        console.log(err);
        
    }


    if(userAlias == undefined){
      console.log('Please insert an alias argument to delete');
      isValid = false;
    }

    return isValid;

  }



}

Delete.description = 'delete a twilio alias';

Delete.args = [
  {
    name: 'name',
    description: 'alias name to delete',
  }
];

module.exports = Delete;


class AliasObject{
  
  constructor(userAlias, userCommand){
    this.name = userAlias;
    this.command = userCommand;
  }

}
