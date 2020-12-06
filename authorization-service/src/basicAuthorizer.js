import { prop, split, isEqual } from 'lodash/fp'
import { decodeCredentials, generatePolicy, tokenEventType } from "./helpers";

export const basicAuthorizer = async (event, ctx, cb) => {
    console.log(`BasicAuthorizer event: ${JSON.stringify(event)}`)

  if (event['type'] !== tokenEventType) {
      cb('Unauthorized')
  }

    try {
        const authorizationToken = prop('authorizationToken', event)
        const encodedCredentials = split(' ', authorizationToken)[1]
        const credentials = decodeCredentials(encodedCredentials)
        console.log(`BasicAuthorizer credentials: username = ${credentials.username}, password = ${credentials.password}`)
        const userPassword = process.env[credentials.username]

        const effect = !userPassword || !isEqual(userPassword, credentials.password) ? 'Deny' : 'Allow'
        console.log(`BasicAuthorizer effect: ${effect}`)

        const policy = generatePolicy(encodedCredentials, prop('methodArn', event), effect)
        console.log(`BasicAuthorizer policy: ${JSON.stringify(policy)}`)

        cb(null, policy);

    } catch (e) {
        console.error(`BasicAuthorizer error: ${e.message}`)
        cb(`Unauthorized ${e.message}`)
    }
}