import express from 'express'
import { Server } from 'http'

const port = process.env.PORT || 4000

const app = express()

const startedTests = {}

app.get('/test/:testId', (req, res, next) => {
  if (startedTests[req.params.testId]?.started) {
    res.status(200).send({ started: true })
    return
  }

  res.send({ started: false })
})

app.post('/test/:testId/start', (req, res, next) => {
  const time = Date.now()

  if (!startedTests[req.params.testId]?.started) {
    startedTests[req.params.testId] = {
      started: true,
      time
    }

    res.status(200).send({ started: true, time })
    return
  }

  res.status(400).send({ message: 'Test already running' })
})

app.post('/test/:testId/stop', (req, res, next) => {
  if (startedTests[req.params.testId]?.started) {
    delete startedTests[req.params.testId]

    res.status(200).send({ stopped: true })
    return
  }

  res.status(400).send({ message: 'Test not running' })
})

app.set('port', port)

const http = new Server(app)

http.listen(port, () => console.log(`Graph listening on port ${port}`))
