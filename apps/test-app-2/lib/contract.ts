import BigNumber from "bignumber.js"
import { ethers, Contract } from "ethers"

export const exec = async (contract: Contract, contractMethod: string, args: any = []) => {
  const execArgs = [...args]
  let estimatedGas: ethers.BigNumber
  try {
    estimatedGas =
      await contract.estimateGas[contractMethod](...args)
  } catch (error: any) {
    if (error.message.includes('reason="execution reverted:')) {
       const reason = error.message.split('reason="execution reverted:')[1].split('"')[0]
       throw error
    }
    console.error(error, `${contractMethod}-estimatedGas`)
    throw error
  }
  if (estimatedGas) {
    execArgs.push({
      gasLimit: new BigNumber(estimatedGas.toString()).multipliedBy(2).toFixed(0),
    })
  } else {
    const manualGas = ethers.utils.parseUnits('36000', 'wei')
    execArgs.push({
      gasLimit: manualGas
    })
  }
  const res = await contract[contractMethod](...execArgs)
  await res.wait()
}
