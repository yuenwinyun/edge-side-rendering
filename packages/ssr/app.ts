import express from "express"

const app = express()

app.get("/", (_, res) => {
  res.status(200).end("ok")
})

app.listen(3000)