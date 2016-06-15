/**
 * Created by mpio on 16/06/16.
 */
const cronJob = require('cron').cronJob;


class Job {
    constructor(initData) {
        this.job      = new cronJob(initData.interval, initData.callback);
        this.interval = initData.interval;
        this.mextTime = undefined;  //TODO method computing next time
        this.name     = initData.name;
    };

    add(initData) {
        var newJob = new Job(initData);
        Job.elements[initData.name] = newJob;
    };

    getNextTime (interval) {

    };
}


Job.elements = {};
Job.oneTimes = {};


* define cronJob
* store all existing jobs (per kind ie AM, parser)
* store scheduling interval
* store next scheduling time
* create cron job with human readable intervals
* allow for nonrecuring exec (special case immediately)
* job callback should be defined elsewere:
    * in the dataprocessormodels?
    * in a dedicated place?


