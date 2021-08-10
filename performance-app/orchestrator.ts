// import { spawn } from 'child_process'
import cluster from 'cluster'
import { createPeer } from './index'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const numCPUs = require('os').cpus().length

async function createPeerAndWait() {
  await sleep(Math.random() * numCPUs * 5500)
  await createPeer()
}

if (cluster.isMaster || cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < 50; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
  })
} else {
  // Workers can share any TCP connection
  createPeerAndWait().catch(() => {})
  console.log(`Worker ${process.pid} started`)
}

// function spawnPerfApp(id: string) {
//   const ls = spawn('node', [__dirname + '/index.js', `NUMBER_OF_PEERS=4 TEST_ID=${id}`])

//   ls.stdout.on('data', (data) => {
//     console.log(`stdout ${id}: ${data}`)
//   })

//   ls.stderr.on('data', (data) => {
//     console.error(`stderr ${id}: ${data}`)
//   })

//   ls.on('close', (code) => {
//     console.log(`child process ${id} exited with code ${code}`)
//   })
// }

// const numberOfPerfApps = parseInt(process.env.NUMBER_OF_APPS ?? '2')

// async function main() {
//   for (let index = 0; index < numberOfPerfApps; index++) {
//     spawnPerfApp(index.toString())
//     await sleep(Math.random() * 5000)
//   }
// }

// main().catch((err) => {
//   console.error(`The orchestrator exited with error: ${err}`)
// })
