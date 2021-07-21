export function fromNum(number: number): string {
  const isK = number > 999
  const isMill = number > 999999
  const isMillia = number > 999999999

  return isMillia ? 
    `${(number/1000000000).toFixed(3)} Billion.` : isMill ? 
    `${(number/1000000).toFixed(3)} Mio.` : isK ? 
    `${(number/1000).toFixed(3)} K` : `${number.toString()}`
}