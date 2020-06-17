import superagent from 'superagent';

export async function doJsonPost<T>(path: string, payload: any): Promise<T> {
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

export async function doJsonGet<T>(path: string, query: any): Promise<T> {
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
