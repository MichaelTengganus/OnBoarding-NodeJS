import fp from 'fastify-plugin';
import { SimpleIntervalJob, AsyncTask, Task } from 'toad-scheduler'

let counter = 0;

export default fp(async (server, options) => {

    // must use promise
    const taskDummy = new AsyncTask('scheduller', () => new Promise((resolve, reject) => {
        console.log(`----------------Start Job ${Date.now().toString()}----------------`);
        try {
            console.log('taskDummy | counter : '+counter);
            counter++
            resolve();
        } catch (error) {
            console.error('JobRunning1 - error');
            reject();
        } finally {
            console.log(`----------------End of Job ${Date.now().toString()}----------------`);
        }
    }), err => {
        console.log('JobRunning1 - error', err);
    });

    const job1 = new SimpleIntervalJob({ seconds: 15, }, taskDummy, 'jobDummyId1')
    server.scheduler.addSimpleIntervalJob(job1);
});