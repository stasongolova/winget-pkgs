import { Provider, Contract, RpcProvider } from "starknet";
import { createRequire } from 'node:module';
import Excel from 'exceljs';

const require = createRequire(import.meta.url);


const provider = new RpcProvider({
  nodeUrl: 'https://starknet-goerli.infura.io/v3/2bffa0d14851400386f37ed100bdaf92',
})

const testAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const { abi: testAbi } = await provider.getClassAt("0x000fa904eea70850fdd44e155dcc79a8d96515755ed43990ff4e7e7c096673e7");
if (testAbi === undefined) { throw new Error("no abi.") };
const myTestContract = new Contract(testAbi, testAddress, provider);

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');

const fs = require('fs');
let arr = fs.readFileSync('./balances.txt').toString('UTF8').split('\n');

for (const address of arr) {
  if (address) {
    const balance = await myTestContract.call("balanceOf", [address]);
    console.log(`${address} ${parseInt(balance[0]['low']) / 10 ** 18}`);
    worksheet.addRow([address, parseInt(balance[0]['low']) / 10 ** 18]);
    await workbook.xlsx.writeFile('./balances.xlsx');
  }
}

