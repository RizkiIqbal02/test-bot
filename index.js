const { DisconnectReason, makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')

async function connectToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed', lastDisconnect.error, 'reconnection', shouldReconnect)

            if (shouldReconnect) {
                connectToWhatsapp()
            }
        } else if (connection === 'open') {
            console.log('connected')
        }
    })
    sock.ev.on('creds.update', saveCreds)

    // listen for new messages
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


connectToWhatsapp()