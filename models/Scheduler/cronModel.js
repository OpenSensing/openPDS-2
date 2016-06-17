/**
 * Created by mpio on 16/06/16.
 */
const cronJob    = require('cron').cronJo,
      prettyCron = require('prettycron');


class Job {
    constructor(initData) {
        this.job      = new cronJob(initData.interval, initData.callback);
        this.interval = initData.interval;
        this.mextTime = undefined;  //TODO method computing next time
        this.name     = initData.name;
    };

    static add(initData) {
        var newJob = new Job(initData);
        Job.elements[initData.name] = newJob;
    };

    static intervalToCron (interval) {
        var cron = '';

        // change to cron string and assign to cron var

        return cron 
    };

    getNextTime (interval) {
        
    };


}


Job.elements = {};
Job.oneTimes = {};


* define cronJob
    * fixed possible intervals (eg. 5m, 2h, 1d)
* store all existing jobs (per kind ie AM, parser)
* store scheduling interval
    * crontab format
    * human readable format
* store next scheduling time
* create cron job with human readable intervals
* implement immediate exec (later make possible to allow for nonrecuring exec )
* job callback should be defined elsewere:
    * in the dataprocessormodels?
    * in a dedicated place?


