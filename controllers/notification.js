const { Expo } = require('expo-server-sdk');

module.exports.sendNotification = async ( req, res ) => {
    try {

        const { title, body, data } = req.body;

        let messages = [];
        let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
        const EXPO_ADMIN_TOKEN = process.env.EXPO_PUSH_ADMIN_TOKEN;

        if (!Expo.isExpoPushToken(EXPO_ADMIN_TOKEN)) {
            return res.send({
                success: false,
                message: `Push token ${EXPO_ADMIN_TOKEN} is not a valid Expo push token`
            })
        }

        messages.push({
            to: EXPO_ADMIN_TOKEN,
            sound: 'default',
            title, body, data,
        })

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);

                    res.send({
                        success: true,
                        message: "Notification Sended"
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        })();
       
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
};