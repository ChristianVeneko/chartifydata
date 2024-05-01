export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const query = getQuery(event)
	const code = (query.code ?? null) as string | null
	const state = query.state ?? null
	if (state === null) {
		event.node.res.writeHead(
			301,
			'/#' +
				new URLSearchParams({
					error: 'state_mismatch'
				}).toString()
		)
		event.node.res.end()
	} else {
		const res = await fetch('https://accounts.spotify.com/api/token', {
			body: new URLSearchParams({
				code: code || '',
				redirect_uri: config.redirectUri,
				grant_type: 'authorization_code'
			}).toString(),
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				Authorization:
					'Basic ' + Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64')
			},
			method: 'POST'
		})
		const data = await res.json()
		if (data.access_token) {
			event.node.res.writeHead(301, {
				location: config.public.baseUrl + '/auth?' + new URLSearchParams({
					access_token: data.access_token,
					refresh_token: data.refresh_token
				}).toString()
			})
			event.node.res.end()
		}
	}
})