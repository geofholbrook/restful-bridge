import superagent from 'superagent';

export async function doJsonPost<T>(path: string, payload: any, verbose = true): Promise<T> {

    if (verbose) {
        console.log(`POST ${path} ${JSON.stringify(payload)}`)
    }
    return new Promise((resolve, reject) => {
        superagent
            .post(path)
            .send(payload)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(JSON.parse(res.text));
                }
            });
    });
}

export async function doJsonGet<T>(path: string, query: any, verbose = true): Promise<T> {

    if (verbose) {
        console.log(`GET ${path} ${JSON.stringify(query)}`)
    }


    return new Promise((resolve, reject) => {
        superagent
            .get(path)
            .query(query)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(JSON.parse(res.text));
                }
            });
    });
}
