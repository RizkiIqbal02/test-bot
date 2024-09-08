const handler = (sock) => {
    sock.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key.fromMe) {
            return
        }

        console.log('message from : ' + JSON.stringify(m.messages[0].pushName))
        console.log('message : ' + JSON.stringify(m.messages[0].message.conversation))

        console.log('replying to', m.messages[0].key.remoteJid)
        await sock.sendMessage(m.messages[0].key.remoteJid, { text: m.messages[0].message.conversation })
    })
}

module.exports = handler