import {
    Prodia
} from "prodia.js";
const prodia = new Prodia(api.prodia);
const isUrl = (text) => {
    return text.match(new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|png)/, 'gi'))
}
let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {

    let [urutan, tema] = text.split(" ")
    if (!tema) return m.reply("Input query!\n*Example:*\n.faceswap [url] [url]")

    await m.reply(wait)
    try {

        if (!isUrl(urutan) || !isUrl(tema)) return m.reply("Input query!\n*Example:*\n.faceswap [url] [url]")
        
        const generateImageParams = {
            sourceUrl: urutan,
            targetUrl: tema
        };
        const openAIResponse = await generateImage(generateImageParams);

        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result.imageUrl
                },
                caption: `Nih effect *${command}* nya\nRequest by: ${tag}`,
                mentions: [m.sender]
            }, {
                quoted: m
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        await m.reply(e)
    }
}
handler.help = ["faceswap *[url] [url]*"]
handler.tags = ["ai"]
handler.command = /^(faceswap)$/i
export default handler

async function generateImage(params) {
    const generate = await prodia.faceSwap(params);
    while (generate.status !== "succeeded" && generate.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const job = await prodia.getJob(generate.job);
        if (job.status === "succeeded") {
            return job;
        }
    }
}