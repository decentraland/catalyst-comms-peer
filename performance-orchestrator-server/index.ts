import express from 'express'
import { readFileSync } from 'fs'
import { Server } from 'http'

const port = process.env.PORT || 4000

export function startServer() {
  const app = express()

  app.get('/test/:testId', (req, res, next) => {
    if (
      req.params.testId === process.env.TEST_ID &&
      JSON.parse(readFileSync('./test_status.json').toString()).started
    ) {
      res.status(200).send({ started: true })
      return
    }

    res.send({ started: false })
  })

  app.set('port', port)

  const http = new Server(app)

  http.listen(port, () => console.log(`Graph listening on port ${port}`))
}
