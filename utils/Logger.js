class Logger {

  static getTimeStamp() {
    return `[${new Date().toLocaleString('nl-NL')}]`;
  }

  static log(...message) {
    console.log(this.getTimeStamp(), ...message);
  }

  static info(...message) {
    console.info(this.getTimeStamp(), ...message);
  }

  static warn(...message) {
    console.warn(this.getTimeStamp(), ...message);
  }

  static error(...message) {
    console.error(this.getTimeStamp(), ...message);
  }
}

module.exports = Logger;