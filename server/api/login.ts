import { generateRandomString } from "~/utils/generateRandomString"

export default defineEventHandler(({ node }) => {
  const config = useRuntimeConfig()
  const state = generateRandomString(16)
  const scope = "user-read-private user-read-email user-top-read"
  node.res.writeHead(301, {
    location:
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: config.clientId,
        scope: scope,
        redirect_uri: config.redirectUri,
        state: state,
      }).toString(),
  })
  node.res.end()
})