import { fetchIt } from './routes'

setTimeout(async () => {
    const response = await fetchIt({})
    console.log(response.result)
}
    , 2000)
