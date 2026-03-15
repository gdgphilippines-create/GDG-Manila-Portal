export function createNotImplementedError(providerName) {
  return new Error(`${providerName} is not implemented`)
}
