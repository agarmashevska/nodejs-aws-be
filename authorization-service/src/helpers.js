export const tokenEventType = 'TOKEN'

export const decodeCredentials = encodedCredentials => {
    const buff = Buffer.from(encodedCredentials, 'base64')
    const credentials = buff.toString('utf-8').split(':')
    const username = credentials[0]
    const password = credentials[1]

    return { username, password }
}

export function generatePolicy(principalId, resource, effect = 'Allow') {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ]
        }
    }
}