import { SiweMessage } from 'siwe';
import { WalletClient } from 'viem';

export async function  createSiweMessage(address: string, statement: string, client: WalletClient) {
  const scheme = window.location.protocol.slice(0, -1);
  const domain = window.location.host;
  const origin = window.location.origin;
  const chainId = await client.getChainId()
  const messageGen = new SiweMessage({
    scheme,
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: chainId,
  });
  const message = messageGen.prepareMessage();
  const [account] = await client.getAddresses();
  const signature = await client.signMessage({
    message,
    account,
  });
  window.localStorage.setItem('message', window.btoa(message));
  window.localStorage.setItem('signature', window.btoa(signature));
}
