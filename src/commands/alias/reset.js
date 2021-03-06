const AliasBaseCommand = require('../../utilities/AliasBaseCommand')
const FileUtil = require('../../utilities/FileUtility.js')

class Reset extends AliasBaseCommand {
  async run () {
    await super.run()

    if (this.argv.length > 0) {
      let args = ''
      for (const arg in this.argv) {
        args += "'" + this.argv[arg] + "' "
      }
      console.log(`Invalid argument ${args}provided`)
      return
    }

    // Store the aliases file in the current directory
    const mPath = String(new FileUtil(this).getAliasFilePath())
    const aliasFolderPath = (mPath.length > 10 ? mPath.slice(0, mPath.length - 10) : '')

    try {
      if (new FileUtil(this).pathExists(aliasFolderPath)) {
        new FileUtil(this).removeDirectory(aliasFolderPath)
      }

      console.log('reset complete')
    } catch (err) {
      return console.log(err)
    }
  }
}
Reset.hidden = true
Reset.id = 'alias:reset'
Reset.description = 'reset to empty'
module.exports = Reset
