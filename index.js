const express = require('express')

const app = express()
const PORT = process.env.PORT || 5000

const { EmbedBuilder, WebhookClient, AttachmentBuilder } = require('discord.js') 
const webhookClient = new WebhookClient({ id: process.env.ID, token: process.env.TOKEN })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')

    // res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src * data: blob: 'unsafe-inline';")
    
    next()
})
app.use(express.json({ limit: '1mb' }))

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}, wacky23`)
})

app.post('/send_question', (req, res) => {
    const { question } = req.body

    if (!question) {
        res.status(400).send({ message: 'Question not provided' })
        return
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Question asked` })
        .setTitle(question)

    webhookClient.send({ embeds: [embed] })
        .then(message => {
            res.status(200).send({ message: `Sent question: ${question}` })
        })
        .catch(console.error)
})

app.post('/send_art', (req, res) => {
    const { image } = req.body

    if (!image) {
        res.status(400).send({ message: 'Art not provided' })
        return
    }

    const buffer = new Buffer.from(image, 'base64')
    const attachment = new AttachmentBuilder(buffer, 'output.png')    

    webhookClient.send({ content: 'Art sent', files: [attachment] })
        .then(message => {
            res.status(200).send({ message: `Sent art` })
        })
        .catch(console.error)
})
