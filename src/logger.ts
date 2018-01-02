import chalk from "chalk"
let prefix: string = '[WCER]: '

export const log = (message: string) => console.log(prefix+message)
export const info =  (message: string) => console.info(chalk.green(prefix+message))
export const warn =  (message: string) => console.warn(chalk.yellow(prefix+message))
export const error = (message: string) => console.error(chalk.red(prefix+message))
export const debug = (message: string) => console.debug(chalk.white(prefix+message))